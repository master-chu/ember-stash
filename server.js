var request       = require('request'),
    app           = require('express')(),
    _             = require('lodash'),
    colors        = require('colors'),
    config        = require('./config.js'),
    log           = require('./logger.js').logger,
    messageLookup = require('./logger.js').messageLookup;

var stashHost = 'https://stash.zipcar.com';

config.initialize(runServer);

function runServer(authString){
  var authHeaders = {
    'Authorization': 'Basic ' + authString
  };

  var username = config.getUsername(authString);
  var userOptions = {
    url: stashHost + '/rest/api/1.0/users/' + username,
    headers: authHeaders
  };

  request(userOptions, function checkUserExists(error, response, body) {
    var statusCode = response.statusCode || '';
    var error = error || '';
    if (!error && statusCode == 200) {
      app.get('/', function (req, res){
        var firstName = JSON.parse(body).displayName.split(' ')[0];
        res.send(messageLookup('hi_wrong_page', firstName));
      });
      runServerAuthenticated(authString);
    } else {
      terminateServer(error, statusCode);
    }
  });

  function terminateServer(error, statusCode){
    log.error('log_in_failure', username, statusCode);
    log.error('reason_for_login_failure');
    log.warn('force_login_instructions');
    process.exit(1);
  }

  function runServerAuthenticated(){
    log.success('log_in_success', username);
    log.warn('force_login_instructions');

    app.get('/pullRequests', function (req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");

      var pullRequestsPath = '/rest/inbox/latest/pull-requests?avatarSize=48&withAttributes=true';

      var createdOptions = {
        url: stashHost + pullRequestsPath + '&role=author',
        headers: authHeaders
      };
      var reviewingOptions = {
        url: stashHost + pullRequestsPath + '&role=reviewer',
        headers: authHeaders
      };

      // has to make 2 separate requests because of limitation in stash rest api
      request(createdOptions, function getCreatedPullRequests(error, response, body) {
        if (!error && response.statusCode == 200) {
          var created = serializePullRequests(body, 'author');

          request(reviewingOptions, function getReviewingPullRequests(error, response, body) {
            if (!error && response.statusCode == 200) {
              var reviewing = serializePullRequests(body, 'reviewer');
              var serializedPullRequestsWithRoot = {
                pullRequests: created.concat(reviewing)
              }
              res.send(serializedPullRequestsWithRoot);
            } else {
              log.error('fetch_failed', username);
            }
          });

        } else {
          log.error('fetch_failed', username);
        }
      });
    });

    var port = 42069;
    app.listen(port);
    log.notice('server_started_on_port', port.toString());
    log.notice('to_access_app');
  }
}

function serializePullRequests(body, role){
  var pullRequests = JSON.parse(body).values;
  var serializedPullRequests = [];

  _.forEach(pullRequests, function(pullRequest){
    serializedPullRequests.push({
      id: pullRequest.id,
      title: pullRequest.title,
      repository: pullRequest.fromRef.repository.name,
      repositoryAvatarUrl: stashHost + "" + pullRequest.fromRef.repository.project.avatarUrl,
      link: stashHost + "" + pullRequest.link.url,
      role: role,
      author: pullRequest.author.user.displayName,
      authorAvatarUrl: stashHost + "" + pullRequest.author.user.avatarUrl,
      reviewerAvatarUrls: getReviewerAvatarUrls(),
      commentCount: pullRequest["attributes"].commentCount
    });

    function getReviewerAvatarUrls(){
      var reviewerAvatarUrls = [];
      //Todo: if _ supports it, can return result of map
      _.forEach(pullRequest.reviewers, function(reviewer){
        var url = reviewer.user.avatarUrl;
        if(!_.includes(url, 'gravatar.com')) {
          url = stashHost + "" + url;
        }
        reviewerAvatarUrls.push(url);
      });
      return reviewerAvatarUrls;
    }
  });



  return serializedPullRequests;
}