var colors           = require('colors'),
    _                = require('lodash'),
    sprintf          = require('sprintf-js').sprintf,
    messageTemplates = require('./message_templates.js');

module.exports.logger = {
  notice: function(key){
    logWithColor(key, 'white', arguments);
  },
  success: function(key){
    logWithColor(key, 'green', arguments);
  },
  warn: function(key){
    logWithColor(key, 'yellow', arguments);
  },
  error: function(key){
    logWithColor(key, 'red', arguments);
  }
};

function logWithColor(key, color, args){
  var templateArgs = normalizeTemplateArgs(args);
  log(key, color, templateArgs);
}
  
module.exports.messageLookup = function(key){
  var templateArgs = normalizeTemplateArgs(arguments);
  var template = messageTemplates[key];
  templateArgs.unshift(template);
  return substituteArgsIntoTemplate(templateArgs);
}

function normalizeTemplateArgs(args){
  var templateArgs = [];
  _.forEach(args, function(val){
    templateArgs.push(val);
  });
  removeKeyArg();
  return templateArgs;

  function removeKeyArg(){
    templateArgs.shift();
  }
}

function log(key, color, templateArgs){
  var template = getTemplate(key, color);
  templateArgs.unshift(template); //adds to front of array
  var resultString = substituteArgsIntoTemplate(templateArgs);
  console.log(resultString);// don't delete this line
};

function getTemplate(key, color){
  if (messageTemplates.hasOwnProperty(key)) {
    return messageTemplates[key][color];
  } else {
    return messageTemplates['key_does_not_exist']['magenta'];
  }
};

function substituteArgsIntoTemplate(templateArgs){
  return sprintf.apply(null, templateArgs)
}
