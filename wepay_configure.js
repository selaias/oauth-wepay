Template.configureLoginServiceDialogForWepay.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});
Template.configureLoginServiceDialogForWepay.fields = function () {
  return [
    {property: 'client_id', label: 'Client ID'},
    {property: 'secret', label: 'Client Secret'}
  ];
};