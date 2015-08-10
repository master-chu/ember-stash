App = Ember.Application.create({});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://localhost:42069'
});

App.Router.map(function(){
  this.resource('pull-requests');
});

App.PullRequestsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('pullRequest');
  }
});

App.PullRequest = DS.Model.extend({
  title: DS.attr('string'),
  repository: DS.attr('string'),
  link: DS.attr('string')
});


// Eventually can delete this
App.IndexController = Ember.Controller.extend({
  message: 'Hello! See how index.hbs is evaluated in the context of IndexController' 
});


