var request = require('request'),
    app     = require('express')(),
    _       = require('lodash'),
    colors  = require('colors'),
    config  = require('./config.js');

var stashHost = 'https://stash.zipcar.com';

config.initialize(runServer);

function runServer(authString){
  var options = {
    url: stashHost + '/rest/api/latest/profile/recent/repos',
    headers: {
      'Authorization': 'Basic ' + authString
    }
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      runServerAuthenticated(authString);
    } else {
      console.log('Login for user '.red + config.getUsername(authString).red + ' failed'.red);
      console.log('Either there are network issues, or a user with this username and password doesn\'t exist');
      console.log('To re-enter user credentials, do ' + './run.sh -l'.yellow);
      process.exit(1);
    }
  });
}

function runServerAuthenticated(authString){
  console.log('Logged in as Stash user '.green + config.getUsername(authString).green + '.'.green);
  console.log('To re-enter user credentials, do ' + './run.sh -l'.yellow);

  app.get('/', function (req, res){
    res.send('Hi! You probably misread the cli instructions. To access the app, just open index.html in your browser.');
  });

  app.get('/pullRequests', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var options = {
      url: stashHost + "" + '/rest/inbox/latest/pull-requests?role=reviewer',
      headers: {
        'Authorization': 'Basic ' + authString
      }
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(serializePullRequests(body));
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

function serializePullRequests(body){
  var pullRequests = JSON.parse(body).values;
  var serializedPullRequests = {
    pullRequests: []
  };

  _.forEach(pullRequests, function(pullRequest){
    serializedPullRequests.pullRequests.push({
      id: pullRequest.id,
      title: pullRequest.title,
      repository: pullRequest.fromRef.repository.name,
      link: stashHost + "" + pullRequest.link.url
    });    
  });

  return serializedPullRequests;
}