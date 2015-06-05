Package.describe({
  name: 'selaias:oauth-wepay',
  version: '0.1.1',
  summary: 'An implementation of the Wepay OAuth flow.',
  git: 'https://github.com/selaias/oauth-wepay.git',
  documentation: 'README.md'
});

Npm.depends({'request': "2.53.0"});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  
  api.export('WePay');
  
  api.addFiles(['wepay_configure.html', 'wepay_configure.js'], 'client');
  api.addFiles('wepay_server.js', 'server');
  api.addFiles('wepay_client.js', 'client');

});

