var colors           = require('colors'),
    _                = require('lodash'),
    sprintf          = require('sprintf-js').sprintf,
    messageTemplates = require('./message_templates.js');

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
  var template = messageTemplates[key];
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
