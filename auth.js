const okta = require("@okta/okta-sdk-nodejs");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;


// Define an Okta client so any user management tasks can be performed
const oktaClient = new okta.Client({
  orgUrl: 'https://dev-455895.okta.com',
  token: '00AHiDM36e3uBZTUXW58G-uvI-7Qjeslg7arrWVqYa'
});

// Define the OpenID Connect client
const oidc = new ExpressOIDC({
  issuer: 'https://dev-455895.okta.com' + "/oauth2/default",
  client_id: '0oalm9r4fjoRzagiM356',
  client_secret: 'HRYUUl-VxkIO4WAS4O0WT7cKUfdya4dERVZdf5zg',
  redirect_uri: process.env.OKTA_CALLBACK_URI || "http://localhost:3000/users/callback",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});


module.exports = { oidc, oktaClient };
