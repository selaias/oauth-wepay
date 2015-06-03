WePay = {};

// Request Wepay credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
WePay.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'wePay'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  var credentialToken = Random.secret();

  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  var display = mobile ? 'touch' : 'popup';

  var scope = ["manage_accounts","collect_payments","view_user","send_money","preapprove_payments"];
  if (options && options.requestPermissions)
    scope = options.requestPermissions.join(',');

  var loginStyle = OAuth._loginStyle('wePay', config, options);

  var loginUrl =
        'https://stage.wepay.com/v2/oauth2/authorize?client_id=' + config.client_id +
        '&redirect_uri=' + OAuth._redirectUri('wePay', config) +
        '&display=' + display + '&scope=' + scope +
        '&response_type=code' +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "wePay",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};
