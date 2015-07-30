App = Ember.Application.create({});

App.Router.map(function(){
  this.route('reviews');
});

// Eventually can delete this
App.IndexController = Ember.Controller.extend({
  message: 'Hello! See how index.hbs is evaluated in the context of IndexController' 
});


