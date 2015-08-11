var request = require('request'),
    app     = require('express')(),
    _       = require('lodash'),
    fs      = require('fs'),
    atob    = require('atob');

var stashHost = 'https://stash.zipcar.com';
var apiPath = '/rest/inbox/latest/pull-requests?role=reviewer';
var authString = fs.readFileSync('auth_string.txt').toString().trim();
var options = {
  url: stashHost + "" + apiPath,
  headers: {
    'Authorization': 'Basic ' + authString
  }
};

console.log('Logged in as ' + atob(authString).split(':')[0]);

app.get('/pullRequests', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(serializePullRequests(body));
    } else {
      res.send('you done goofed');
    }
  });
});

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

var port = 42069;
app.listen(port);
console.log('Stash proxy started; Open index.html in your browser.');