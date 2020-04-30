var http = require('http');
var url = require('url');

const sendRequest = async ({
  serviceUrl,
  httpMethod = 'POST',
  requestBody,
  requestHeader = {
    'content-type': 'application/json'
  },
  options = {
    port: 80,
    timeout: 10000
  }
}) => {
  let parsedUrl;
  try {
    parsedUrl = url.parse(serviceUrl);
  } catch (error) {
    throw new Error(`Invalid url ${serviceUrl}`);
  }
  let requestOptions = {
    hostname: parsedUrl.hostname,
    port: options.port,
    path: parsedUrl.path,
    method: httpMethod,
    headers: requestHeader,
    timeout: options.timeout
  };
  return new Promise((resolve, reject) => {
    const clientRequest = http.request(requestOptions, (incomingMessage) => {
      let response = {
        statusCode: incomingMessage.statusCode,
        statusMessage: incomingMessage.statusMessage,
        headers: incomingMessage.headers,
        body: []
      };
      incomingMessage.on('data', (chunk) => {
        response.body.push(chunk);
      });
      incomingMessage.on('end', () => {
        console.log('Status code: ' + response.statusCode);
        console.log('Status message: ' + response.statusMessage);
        try {
          response.body = response.body.join(); /*console.log('Response Body: ' + JSON.parse(response.body));*/
        } catch (e) {
          response.body = null;
        }
        if (response.statusCode < 400) {
          return resolve(response);
        } else {
          return reject(response);
        }
      });
    });
    clientRequest.on('timeout', () => {
      clientRequest.abort();
    });
    clientRequest.on('error', (error) => {
      return reject(error);
    });
    if (requestBody) {
      clientRequest.write(JSON.stringify(requestBody));
    }
    clientRequest.end();
  });
};

module.exports = {
  sendRequest
};