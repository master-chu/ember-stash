App = Ember.Application.create({});
// App.ApplicationAdapter = DS.RESTAdapter.extend({
//   // host: 'https://stash.zipcar.com',
//   // ajax: function(url, method, hash) {
//   //   hash.crossDomain = true;
//   //   hash.xhrFields = {withCredentials: true};
//   //   return this._super(url, method, hash);
//   // }
// });

App.Router.map(function(){
  this.resource('pull-requests', function(){
    this.resource('pull-request')
  });
});

App.PullRequestsRoute = Ember.Route.extend({
  model: function() {
    var url = 'https://stash.zipcar.com/rest/inbox/latest/pull-requests';
    // var url = 'https://api.github.com/repos/emberjs/ember.js/pulls';
    // return Ember.$.getJSON(url).then(function(data){
    //   debugger;
    //   return data;
    // });
    return $.ajax({
      url: url,
      dataType: 'json',
      method: 'GET',
      crossDomain: true,
      xhrFields: {withCredentials: true},
    }).then(function(data){
      alert("SUCCESS!!");
      return data;
    }).fail(function(xhr, status, error) {
      console.log(xhr);
    });
  }
});

App.PullRequest = DS.Model.extend();

// App.PullRequestAdapter = App.ApplicationAdapter.extend({
//   // namespace: 'rest/inbox/latest',
//   // pathForType: function(){
//   //   return 'pull-requests';
//   // },
// });


// Eventually can delete this
App.IndexController = Ember.Controller.extend({
  message: 'Hello! See how index.hbs is evaluated in the context of IndexController' 
});


