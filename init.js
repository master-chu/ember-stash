var prompt = require('prompt');
var btoa = require('btoa');
var fs = require('fs');

console.log('Please enter your credentials for stash.zipcar.com');

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
  var destFile = 'auth_string';

  fs.writeFile(destFile, authString, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log('Your encoded authentication string is ' + authString + '.');
    console.log('It has been saved to the file ' + destFile + '.');
  }); 

});
