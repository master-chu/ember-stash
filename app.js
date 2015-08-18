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

App.PullRequest = DS.Model.extend({
  title: DS.attr('string'),
  repository: DS.attr('string'),
  repositoryAvatarUrl: DS.attr('string'),
  link: DS.attr('string'),
  role: DS.attr('string'),
  author: DS.belongsTo('user'),
  reviewers: DS.hasMany('user'),
  commentCount: DS.attr('number')
});

App.PullRequestSerializer = DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    author: { embedded: 'always' },
    reviewers: { embedded: 'always' }
  },
  isNewSerializerAPI: true
});

App.User = DS.Model.extend({
  name: DS.attr('string'),
  avatarUrl: DS.attr('string')
});

App.IndexController = Ember.Controller.extend({
  message: 'This index page is only here so you can see page transitions.'
});