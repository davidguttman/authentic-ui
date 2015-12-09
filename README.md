# Authentic UI #

Authentic UI is a set of client side views that use authentic-client to provide an easy signup and authentication flow.

Each method will return a DOM element for you to include wherever you need it.

## Examples ##

```js
var qs = require('querystring')
var AuthenticUI = require('authentic-ui')

var aui = AuthenticUI({
  server: 'http://authenticserver.com',
  links: {
    signup: '#/signup',
    login: '#/login',
    changePasswordRequest: '#/change-password-request'
  }
})

// Log In
document.body.appendChild(
  aui.login(function (err, result) {
    // logged in, now redirect to main content
    window.location.hash = '/main-content'
  })
)

// Sign Up
document.body.appendChild(
  aui.signup({
    from: 'Example Signup <example@signup.com>',
    subject: 'Welcome!',
    confirmUrl: window.location.origin + '#/confirm'
  })
)

// Confirm
var query = qs.parse(window.location.search.slice(1))
document.body.appendChild(
  aui.confirm({
    email: query.email,
    confirmToken: query.confirmToken,
    confirmDelay: 5000
  }, function onLogin (err, result) {
    // logged in, now redirect to main content
    window.location.hash = '/main-content'
  })
)

// Change Password Request
document.body.appendChild(
  aui.changePasswordRequest({
    from: 'Example ChangePassword <example@signup.com>',
    subject: 'Change Your Password!',
    changeUrl: window.location.origin + '#/change-password'
  })
)

// Change Password
var query = qs.parse(window.location.search.slice(1))
document.body.appendChild(
  aui.changePassword({
    email: query.email,
    changeToken: query.changeToken,
    confirmDelay: 5000
  }, function onLogin (err, result) {
    // password changed and logged in, now redirect to main content
    window.location.hash = '/main-content'
  })
)

// Log Out
aui.logout() // instant

```

## API ##

### AuthenticUI(opts) ###

This is the main entry point. Accepts an options object and returns an instance.

```js
var aui = AuthenticUI({
  server: 'http://authenticserver.com',
  links: {
    signup: '#/signup',
    login: '#/login',
    changePasswordRequest: '#/change-password-request'
  }
})

// now you can do aui.signup()/login()/etc...
```

#### options ####

`AuthenticUI()` takes an options object as its argument, only `server` is required:

* `server`: the url of the `authentic-server`, e.g. 'http://auth.yourdomain.com'

Optional:

* `prefix`: defaults to `/auth` -- if you set a custom prefix for your `authentic-server`, use that same prefix here
* `links`: if provided, AuthenticUI will display links to signup, login, and change-password (when appropriate)
* `styles`: by default AuthenticUI is styled, but to remove styling you may pass `styles: false`, or pass in an object with your own styles (see `lib/styles.js` for an example)

### aui.authToken() ###

Returns the user's `authToken` if one exists/the user is logged in.

### aui.login(onLogin)

Returns a login element. Will also call `onLogin` when successfully logged in.

```js
var el =  aui.login(function (err, result) {
  // logged in, now redirect to main content
  window.location.hash = '/main-content'
})
```

### aui.signup(opts)

Returns a signup element. Options are passed through `authentic-client` to `authentic-server`. Will display a message to check email after successful submission.

```js
var el = aui.signup({
  confirmUrl: window.location.origin + '#/confirm'
})
```

### aui.confirm(opts, onLogin)

Returns a confirm element. Will display a message if there's an error, otherwise will call `onLogin` after `confirmDelay` milliseconds if successfully logged in. Required options: `email` and `confirmToken`.

```js
var query = require('querystring').parse(window.location.search.slice(1))
var el = aui.confirm({
  email: query.email,
  confirmToken: query.confirmToken,
  confirmDelay: 5000
}, function onLogin (err, result) {
  // logged in, now redirect to main content
  window.location.hash = '/main-content'
})
```

### aui.changePasswordRequest(opts)

Returns a change-password-request element. Options are passed through `authentic-client` to `authentic-server`. Will display a message to check email after successful submission.

```js
var el = aui.changePasswordRequest({
  changeUrl: window.location.origin + '#/change-password'
})
```

### aui.changePassword(opts, onLogin)

Returns a change-password element. Required options: `email` and `changeToken`. Will also call `onLogin` when successfully logged in after password change.

```js
var query = require('querystring').parse(window.location.search.slice(1))
var el = aui.changePassword({
  email: query.email,
  changeToken: query.changeToken,
  confirmDelay: 5000
}, function onLogin (err, result) {
  // password changed and logged in, now redirect to main content
  window.location.hash = '/main-content'
})
```

### aui.logout() ###

Instantly logs out by forgetting user `email` and `authToken`.

## License ##

MIT
