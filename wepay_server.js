var Future = Npm.require('fibers/future');
var request = Npm.require('request')


WePay = {};

OAuth.registerService('wePay', 2, null, function(query, callback) {

  var response = getTokenResponse(query);
  var accessToken = response.access_token;
  var userData = getUserData(accessToken);
  
 
  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expires_in),
    id: userData.user_id,
    email: userData.email
  };

  // include all fields from wepay
  // http://developer.wepay.com/healthgraph/profile
  var whitelisted = ['user_name', 'first_name', 'last_name', 'email'];

  var fields = _.pick(userData, whitelisted);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: {name: userData.first_name + ' ' + userData.last_name }}
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;


// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {

  var config = ServiceConfiguration.configurations.findOne({service: 'wePay'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var request_params = {
    grant_type: "authorization_code",
    code: query.code,
    client_id: config.client_id,
    client_secret: OAuth.openSecret(config.secret),
    redirect_uri: OAuth._redirectUri('wePay', config)
  };
  var paramlist = [];
  for (var pk in request_params) {
    paramlist.push(pk + "=" + request_params[pk]);
  };
  var body_string = paramlist.join("&");

  var request_details = {
    method: "POST",
    headers: {'User-Agent': userAgent, 'content-type' : 'application/x-www-form-urlencoded'},
    uri: 'https://stage.wepayapi.com/v2/oauth2/token',
    body: body_string
  };

  var fut = new Future();
  request(request_details, function(error, response, body) {
     var responseContent;
    try {
      responseContent = JSON.parse(body);
    } catch(e) {
      error = new Meteor.Error(204, 'Response is not a valid JSON string.');
      fut.throw(error);
    } finally {
      fut.return(responseContent);
    }
  });
  var res = fut.wait();
  return res;
};

//////////////////////////////////////////////// 
// We need to first fetch the UserID
////////////////////////////////////////////////
var getUserData = function (accessToken) {
  
  var fut = new Future();
  var request_user = {
    method: 'GET',
    headers: {'User-Agent': userAgent,  'Content-Type': 'application/json',
              'Authorization' : 'Bearer ' + accessToken},
    uri: "https://stage.wepayapi.com/v2/user"
  };

  request(request_user, function(error, response, body) {
    var responseContent;
    try {
      responseContent = JSON.parse(body);
    } catch(e) {
      error = new Meteor.Error(204, 'Response is not a valid JSON string.');
      fut.throw(error);
    } finally {
      fut.return(responseContent);
    }
  });
  var userRes = fut.wait();
  return userRes;
};

WePay.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
