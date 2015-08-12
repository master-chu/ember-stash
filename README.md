ember-stash
===========

According to wikipedia, Fitts’ law "predicts that the time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target."[1] The default Stash homepage requires a minimum of two clicks on small icons, as well as considerable mouse movement to reach both. This ember application is meant to serve as a more meaningful homepage for engineers so they can see their open reviews.

The real reason is to serve as an example ember app with some basic template rendering and models.

## Installation
```
npm install
./run.sh [-l] # -l will force a new login session
```
If you have not yet logged in, you will be prompted to provide Stash credentials (only the first time).

Once the server is running, you can directly open the `index.html` file in your browser. I personally added it to my browser's bookmarks toolbar for easy access.

## Why do i need the server though
Good question! Normally, Stash allows for CORS requests through their REST API.[2] However, it would appear in our installation, we do not have CORS enabled. So instead, we run a proxy that authenticates server-side. An added benefit of doing it this way is we can serialize the data into something Ember expects, which makes our example app a little more representative of a typical setup.

## References
1. https://en.wikipedia.org/wiki/Fitts%27s_law
2. https://developer.atlassian.com/static/rest/stash/3.11.1/stash-rest.html#authentication
