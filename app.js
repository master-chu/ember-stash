App = Ember.Application.create({});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://localhost:42069'
});

App.Router.map(function(){
  this.resource('pull-requests');
});

App.PullRequestsController = Ember.ArrayController.extend({
  created: function() {
    return this.filterBy('role', 'author');
  }.property('@each.role'),
  reviewing: function() {
    return this.filterBy('role', 'reviewer');
  }.property('@each.role')
});

App.PullRequestsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('pullRequest');
  }
});

App.PullRequestsTableComponent = Ember.Component.extend({
});

App.PullRequest = DS.Model.extend({
  title: DS.attr('string'),
  repository: DS.attr('string'),
  link: DS.attr('string'),
  role: DS.attr('string'),
  author: DS.attr('string'),
  authorAvatarUrl: DS.attr('string')
});

App.IndexController = Ember.Controller.extend({
  message: 'This index page is only here so you can see page transitions.'
});