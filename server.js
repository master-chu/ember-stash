var request = require('request'),
    app     = require('express')(),
    _       = require('lodash');

var stashHost = 'https://stash.zipcar.com';
var apiPath = '/rest/inbox/latest/pull-requests?role=author';
var encodedCredentials = 'Y2NodTpDUzEwMjRuaWNlbHk='; //Base64 encode cchu:<password>
var options = {
  url: stashHost + "" + apiPath,
  headers: {
    'Authorization': 'Basic ' + encodedCredentials
  }
};

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

app.listen(42069);