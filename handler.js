'use strict';
var request = require('request');
var FeedParser = require('feedparser');

module.exports.feed = (event, context, callback) => {
  var feedparser = new FeedParser();
  const response = {
    statusCode: 200,
  };

  // promise that loads feed from mastadon profile atom
  const load = () => new Promise(function(resolve, reject) {
    var req = request('https://vis.social/@travisshears.atom');
    req.on('error', function (error) {
      reject(error);
    });
    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream
      if (res.statusCode !== 200) reject('status not 200');
      else stream.pipe(feedparser);
    });
    var items = [];
    req.on('end', () => {
      resolve(items);
    });
    feedparser.on('error', function (error) {
      reject(error);
    });
    feedparser.on('readable', function () {
      var stream = this; // `this` is `feedparser`, which is a stream
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
      var item;
      while (item = stream.read()) {
        items.push(cleanItem(item));
        console.log('Got toot');
      }
    });
  })


  load()
    .then(items => {
      response.body = JSON.stringify(items);
      callback(null, response);
    });

  function cleanItem(item) {
    let allowedKeys = [
      "title"
      , "description"
      , "summary"
      , "date"
      , "pubdate"
      , "pubDate"
      , "link"
      , "guid"
      , "author"
    ];

    let newItem = {};
    for(var key in item) {
      if(allowedKeys.includes(key)) newItem[key] = item[key];
    }
    return newItem;
  }

};
