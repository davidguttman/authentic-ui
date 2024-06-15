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
    confirmToken: query.confirmToken
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
    changeToken: query.changeToken
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
  },
  googleSignIn: false
})

// now you can do aui.signup()/login()/etc...
```

#### options ####

`AuthenticUI()` takes an options object as its argument, only `server` is required:

* `server`: the url of the `authentic-server`, e.g. 'http://auth.yourdomain.com'

Optional:

* `prefix`: defaults to `/auth` -- if you set a custom prefix for your `authentic-server`, use that same prefix here
* `titles`: AuthenticUI can display custom titles for signup, login, and change-password.
  * If omitted, defaults will be used (`Log in to your account`, etc...).
```js
{
  signup: 'Sign up now!',
  login: 'Log in here 👇',
  changePasswordRequest: 'Let\'s get you a new password'
}
```
* `links`: AuthenticUI can display links to signup, login, and change-password.
  * If omitted, defaults will be used (`#/login`, `#/signup`, etc...).
  * To hide these links use `{links: false}`.
  * If you'd like to customize them, use an object like one of the following:

```js
{
  signup: '#/signup', // text will be "Sign Up"
  login: '#/login', // text will be "Log In"
  changePasswordRequest: '#/change-password-request' // text will be "Reset Password"
}

// or

{
  signup: {href: '#/new-account', text: 'New Account'},
  login: {href: '#/sign-in', text: 'Sign In'},
  changePasswordRequest: {href: '#/forgot', text: 'Forgot something?'}
}
```

* `styles`: If `styles` is omitted, default styling will be used. To clear styling use `{styles: false}`, and to use custom CSS class name(s), use an object that maps components to a string of class names. For example, if you were using [Basscss](http://basscss.com), you could do the following:

```js
{
  box: 'max-width-3 mx-auto border rounded pb2',
  title: 'h3 p2 bold white bg-blue mb2',
  input: 'h4 p1 mb1',
  error: 'red',
  submit: 'btn not-rounded bg-blue white m2',
  disabled: 'bg-silver',
  links: 'p6',
  link: 'italic'
}
```

See `/components/shared/styles.js` for the components and their default styles.

* `googleSignIn`: If `googleSignIn` is `true`, this will add a "Sign in with Google" link to the bottom of the Log In page. Your `authentic-server` needs to have this set up to work.

### aui.authToken() ###

Returns the user's `authToken` if one exists/the user is logged in.

### aui.email() ###

Returns the user's `email` if one exists/the user is logged in.

### aui.login([opts,] onLogin)

Returns a login element. Will also call `onLogin` when successfully logged in.

```js
var el =  aui.login(function (err, result) {
  // logged in, now redirect to main content
  window.location.hash = '/main-content'
})
```

### aui.signup(opts[, onSignup])

Returns a signup element. Options are passed through `authentic-client` to `authentic-server`. Will display a message to check email after successful submission.

```js
var el = aui.signup({
  confirmUrl: window.location.origin + '#/confirm',
  provide: { /* use this to send additional properties to authentic-server */ }
})
```

### aui.confirm(opts, onLogin)

Returns a confirm element. Will display a message if there's an error, otherwise will call `onLogin` after `confirmDelay` milliseconds if successfully logged in. Required options: `email` and `confirmToken`.

```js
var query = require('querystring').parse(window.location.search.slice(1))
var el = aui.confirm({
  email: query.email,
  confirmToken: query.confirmToken
}, function onLogin (err, result) {
  // logged in, now redirect to main content
  window.location.hash = '/main-content'
})
```

### aui.changePasswordRequest(opts[, onReset])

Returns a change-password-request element. Options are passed through `authentic-client` to `authentic-server`. Will display a message to check email after successful submission.

```js
var el = aui.changePasswordRequest({
  changeUrl: window.location.origin + '#/change-password',
  provide: { /* use this to send additional properties to authentic-server */ }
})
```

### aui.changePassword(opts, onLogin)

Returns a change-password element. Required options: `email` and `changeToken`. Will also call `onLogin` when successfully logged in after password change.

```js
var query = require('querystring').parse(window.location.search.slice(1))
var el = aui.changePassword({
  email: query.email,
  changeToken: query.changeToken
}, function onLogin (err, result) {
  // password changed and logged in, now redirect to main content
  window.location.hash = '/main-content'
})
```

### aui.logout() ###

Instantly logs out by forgetting user `email` and `authToken`.

## License ##

MIT
