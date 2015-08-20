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
  }.property('@each.role'),
  poolingApi: function() {
    return this.get('model', { repo: 'pooling-api'});
  }.property()
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
  author: DS.belongsTo('user', { async: false }),
  reviewers: DS.hasMany('user', { async: false }),
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

App.PullRequestsByRepoTableComponent = Ember.Component.extend({
  repoNames: null,
  selectedValue: null,

  didInitAttrs(attrs) {
    this._super(...arguments);
    var repoNames = this.get('repoNames');

    if (!repoNames) {
      this.set('repoNames', []);
    }
  },

  actions: {
    getPullRequestsByRepo: function() {
      var changeAction = this.get('action');
      var selectedEl = this.$('select')[0];
      var selectedIndex = selectedEl.selectedIndex;
      var repoNames = this.get('repoNames');
      var selectedValue = repoNames[selectedIndex];

      this.set('selectedValue', selectedValue);
      changeAction(selectedValue);
    }
  }
});

Ember.Handlebars.registerBoundHelper('is-equal', function(left, right) { 
  return left === right;
});

App.IndexController = Ember.Controller.extend({
  message: 'This index page is only here so you can see page transitions.'
});