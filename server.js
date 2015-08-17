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
    console.log(('Login for user ' + username + ' failed' + ':').red);
    console.log((error + ' (status code ' + statusCode.toString() + ')').red);
    console.log('Either there are network issues, or a user with this username and password doesn\'t exist'.yellow);
    log.warn('force_login_instructions');
    process.exit(1);
  }

  function runServerAuthenticated(){
    log.success('log_in_success', username);
    log.warn('force_login_instructions');

    app.get('/pullRequests', function (req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");

      var pullRequestsPath = '/rest/inbox/latest/pull-requests?avatarSize=48';

      var createdOptions = {
        url: stashHost + pullRequestsPath + '&role=author',
        headers: authHeaders
      };
      var reviewingOptions = {
        url: stashHost + pullRequestsPath + '&role=reviewer',
        headers: authHeaders
      };

      // has to make 2 separate requests because of limitation in stash rest api
      request(createdOptions, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var created = serializePullRequests(body, 'author');

          request(reviewingOptions, function(error, response, body) {
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
    console.log('Stash proxy started on http://localhost:' + port.toString() + '.');
    console.log('To access the app, just open ' + 'index.html'.yellow + ' in your browser.');
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
      link: stashHost + "" + pullRequest.link.url,
      role: role,
      author: pullRequest.author.user.displayName,
      authorAvatarUrl: stashHost + "" + pullRequest.author.user.avatarUrl
    });    
  });

  return serializedPullRequests;
}