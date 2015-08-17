var request = require('request'),
    app     = require('express')(),
    _       = require('lodash'),
    colors  = require('colors'),
    config  = require('./config.js'),
    log     = require('./logger.js');

var stashHost = 'https://stash.zipcar.com';
var authHeaders;


config.initialize(runServer);

function runServer(authString){
  authHeaders = {
    'Authorization': 'Basic ' + authString
  };

  var options = {
    url: stashHost + '/rest/api/latest/profile/recent/repos',
    headers: authHeaders
  };

  request(options, function(error, response, body) {
    var statusCode = response.statusCode || '';
    var error = error || '';
    if (!error && statusCode == 200) {
      runServerAuthenticated(authString);
    } else {
      terminateServer(authString, error, statusCode);
    }
  });
}

function terminateServer(authString, error, statusCode){
  console.log(('Login for user ' + config.getUsername(authString) + ' failed' + ':').red);
  console.log((error + ' (status code ' + statusCode.toString() + ')').red);
  console.log('Either there are network issues, or a user with this username and password doesn\'t exist'.yellow);
  log.warn('force_login_instructions');
  process.exit(1);
}

function runServerAuthenticated(authString){
  log.success('log_in_success', config.getUsername(authString));
  log.warn('force_login_instructions');

  app.get('/', function (req, res){
    res.send('Hi! You probably misread the cli instructions. To access the app, just open index.html in your browser.');
  });

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
            console.log('Fetching pull requests for '.red + config.getUsername(authString) + ' failed'.red);
          }
        });

      } else {
        console.log('Fetching pull requests for '.red + config.getUsername(authString) + ' failed'.red);
      }
    });
  });

  var port = 42069;
  app.listen(port);
  console.log('Stash proxy started on http://localhost:' + port.toString() + '.');
  console.log('To access the app, just open ' + 'index.html'.yellow + ' in your browser.');
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