'use strict';

module.exports.feed = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      key: process.env.APIKEY,
      message: 'Feeeeeeeeeeeeed',
      input: event,
    }),
  };

  const message = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hi');
    }, 2500);
  });

  message()
    .then(msg => {
      callback(null, response);
    });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
