// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_db3jxkrb:llbde8pon2simc9rblk5s90d9c@ds159988.mlab.com:59988/heroku_db3jxkrb',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'L1hQniCxZqeOJiyc2UpMJvtrtLi7eEeB50mn6IrI',
  masterKey: process.env.MASTER_KEY || 'Gece1t91ozjMr7VWHkACQuchhh15D9G4mjnvHBTh', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://tattletype.herokuapp.com/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }, 
  push: {
      android: {
        senderId: '29537110745',
        apiKey: 'AIzaSyC04tbQSE4y0I7TPYcRJd5WLVj2nLU_kTQ'
      },
      ios: {
        pfx: 'Certificates.p12',
        passphrase: '', // optional password to your p12/PFX
        bundleId: 'com.LavishTechnology.TattleType',
        production: true
      }
    },
  verifyUserEmails: false,
  publicServerURL: 'https://tattletype.herokuapp.com/parse/',
  appName: 'TattleType',
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'tattletype@parse.com',
      // Your domain from mailgun.com
      domain: 'mg.lavish.technology',
      // Your API key from mailgun.com
      apiKey: 'key-c0b5ddf82cb2f4767b5e46a3a0a1c662',
    }
  },
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
