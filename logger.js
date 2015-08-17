var colors  = require('colors'),
    _       = require('lodash'),
    sprintf = require("sprintf-js").sprintf;

//TODO: make it its own file
var templates = {
  'prompt_for_credentials': 'Please enter your credentials for ' + 'stash.zipcar.com.'.yellow,
  'log_in_success': 'Logged in as Stash user %s.',
  'force_login_instructions': 'To login as a different user, do ./run.sh -l',
  'fetch_failed': 'Fetching pull requests for %s failed',
  'hi_wrong_page': 'Hi, %s! You probably misread the cli instructions. To access the app, just open index.html in your browser.',
  'log_in_failure': 'Login for user %s failed: statusCode %s',
  'reason_for_login_failure': 'Either there are network issues, or you typed your username or password incorrectly',
  'server_started_on_port': 'Stash proxy started on http://localhost: %s',
  'to_access_app': 'To access the app, just open ' + 'index.html'.yellow + ' in your browser.'
};

module.exports.logger = {
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
};
  
module.exports.messageLookup = function(key){
  var templateArgs = buildTemplateArgs(arguments);
  var template = templates[key];
  templateArgs.unshift(template);
  return substituteArgsIntoTemplate(templateArgs);
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
  var resultString = substituteArgsIntoTemplate(templateArgs);
  console.log(resultString);// don't delete this line
};

function substituteArgsIntoTemplate(templateArgs){
  return sprintf.apply(null, templateArgs)
}
