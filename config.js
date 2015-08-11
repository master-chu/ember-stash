var prompt  = require('prompt'),
    btoa    = require('btoa'),
    atob    = require('atob'),
    fs      = require('fs');

var authStringFile = './auth_string.txt';
var serverCallback;

module.exports = {
  initialize: initialize,
  getUsername: getUsername,
  authStringFile: authStringFile
};

function initialize(callback){
  serverCallback = callback;
  authString = readAuthString();

  if (!authString){
    promptUserForStashCredentials();
  } else {
    console.log('Found stash credentials for user ' + getUsername(authString) + '.');
    serverCallback(authString);
  }
}

function readAuthString(){
  try {
    return fs.readFileSync(authStringFile).toString().trim();
  }
  catch (error) {
    return null;
  }
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
  }], function(error, result) {
    if (error) {
      return function(e) {
        console.log(e);
        return 1;
      };
    } else {
      saveAuthString(btoa(result.username + ":" + result.password));
    }
  });
}

function saveAuthString(authString){
  fs.writeFile(authStringFile, authString, function(error) {
    if(error) {
        return console.log(error);
    }
    serverCallback(authString);
  }); 
}

function getUsername(authString){
  return atob(authString).split(':')[0];
}
