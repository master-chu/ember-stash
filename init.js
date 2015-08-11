var prompt  = require('prompt'),
    btoa    = require('btoa'),
    atob    = require('atob'),
    fs      = require('fs');

var authString;
var authStringFile = './auth_string.txt';

try {
  authString = fs.readFileSync(authStringFile).toString().trim();
  if(!authString){
    console.log('It looks like you\'ve run the server before, but no credentials exist.');
  }
}
catch (error) {
  if (error.code !== 'EOENT') {
    console.log('This appears to be your first time running the server.');
  }
}

if (!authString){
  promptUserForStashCredentials();
} else {
  displaySuccessfulLookupMessage();
}

function promptUserForStashCredentials(){
  console.log('Please enter your credentials for stash.zipcar.com.');

  prompt.start();

  prompt.get([{
    name: 'username',
    required: true
  }, {
    name: 'password',
    required: true,
    hidden: true
  }], function(err, result) {
    if (err) {
      return function(e) {
        console.log(e);
        return 1;
      };
    }

    var authString = btoa(result.username + ":" + result.password);

    fs.writeFile(authStringFile, authString, function(err) {
      if(err) {
          return console.log(err);
      }
      var username = getUsername(authString);
      console.log('Encoded authentication string for ' + username + ' is ' + authString + '.');
      console.log('It has been saved to the file ' + authStringFile + '.');
    }); 
  });
}

function displaySuccessfulLookupMessage(){
  var username = getUsername(authString);
  console.log('Stash user ' + username + ' found! To change users, delete or empty ' + 
    authStringFile + ' and rerun this script.');
}

function getUsername(authString){
  return atob(authString).split(':')[0];
}

