'use strict';
var request = require('request');
var fastFeed = require('fast-feed');

module.exports.getfeed = (event, context, callback) => {
  let getFeed = () => new Promise(function(resolve, reject) {
    request('https://vis.social/@travisshears.atom', function (error, response, body) {
      if (error || response.statusCode !== 200) reject(error);
      resolve(body);
    });
  });
  let parseAtom = str => new Promise(function(resolve, reject) {
    fastFeed.parse(str, function(err, feed) {
      if (err) throw err;
      resolve(feed);
    });
  });

  getFeed()
    .then(str => parseAtom(str))
    .then(obj => {
      //callback(null, obj);
      callback(null, { message: JSON.stringify(obj), event });
    })
    .catch(e => console.log('Error!!!'));
};
