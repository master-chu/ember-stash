var colors  = require('colors'),
    _       = require('lodash'),
    sprintf = require("sprintf-js").sprintf;

//TODO: make it its own file
var templates = {
  'prompt_for_credentials': 'Please enter your credentials for ' + 'stash.zipcar.com.'.yellow,
  'log_in_success': 'Logged in as Stash user %s.',
  'force_login_instructions': 'To login as a different user, do ./run.sh -l'
};

module.exports = {
  notice: function(key){
    var templateArgs = buildTemplateArgs(arguments);
    log(key, 'white', templateArgs);
  },
  success: function(key){
    var templateArgs = buildTemplateArgs(arguments);
    log(key, 'green', templateArgs);
  },
  warn: function(key){
    var templateArgs = buildTemplateArgs(arguments);
    log(key, 'yellow', templateArgs);
  },
  error: function(key){
    var templateArgs = buildTemplateArgs(arguments);
    log(key, 'red', templateArgs);
  }
}

function buildTemplateArgs(args){
  var templateArgs = [];
    _.forEach(args, function(val){
      templateArgs.push(val);
    });
  templateArgs.shift(); //removes key arg
  return templateArgs;
}

function log(key, color, templateArgs){
  var template = templates[key][color];
  templateArgs.unshift(template); //adds to front of array
  var resultString = sprintf.apply(null, templateArgs);
  console.log(resultString);
};