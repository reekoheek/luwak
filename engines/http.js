'use strict';

const superagent = require('superagent');

module.exports = function(options) {
  var agent = superagent.agent(options || {});

  // console.log('using engine: http');
  return function(context) {

    return agent
      .get(context.url)
      .set(context.headers)
      .then(function(res) {
        context.status = res.status;
        context.set(res.headers);
        context.body = 'application/json' == context.type ? res.body : res.text;

        // update the URL if there were redirects
        context.url = res.redirects.length ? res.redirects.pop() : context.url;

        return context;
      }, function(e) {
        if (e && !e.status) {
          throw e;
        }
        context.status = e.status;
        return context;
      });
  };
};