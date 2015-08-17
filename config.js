var prompt  = require('prompt'),
    btoa    = require('btoa'),
    atob    = require('atob'),
    fs      = require('fs'),
    colors  = require('colors'),
    log     = require('./logger.js').logger;

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
  log.notice('prompt_for_credentials');

  prompt.start();

  prompt.get([{
    name: 'username',
    required: true
  }, {
    name: 'password',
    required: true,
    hidden: true
  }], prepareToSaveAuthString);
}

function prepareToSaveAuthString(error, result) {
  if (error) {
    return function(e) {
      console.log(e);
      return 1;
    };
  } else {
    saveAuthString(btoa(result.username + ":" + result.password));
  }
}


function saveAuthString(authString){
  fs.writeFile(authStringFile, authString, function(error) {
    if (error) {
        return console.log(error);
    }
    serverCallback(authString);
  }); 
}

function getUsername(authString){
  return atob(authString).split(':')[0];  
}
