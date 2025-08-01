var xtend = require('xtend')

var Box = require('./shared/box')
var createLinks = require('./shared/create-links')
var autoRetry = require('./shared/auto-retry')

var REDIRECT_PARAM = 'jwt'

module.exports = function login (state, onLogin) {
  var _onLogin = typeof onLogin === 'function' ? onLogin : function () { }
  var defaults = {
    title: 'Log in to Your Account',
    fields: [
      { name: 'email', placeholder: 'Email' },
      { name: 'password', placeholder: 'Password', type: 'password' }
    ],
    links: {
      signup: {text: 'Create Account', href: '#/signup'},
      changePasswordRequest: {
        text: 'Reset Password', href: '#/change-password-request'
      }
    },
    styles: true,
    submitText: 'Login'
  }

  state = xtend(defaults, state)
  var el = render(state)

  var query = new URLSearchParams(window.location.search)
  var jwt = query.get(REDIRECT_PARAM)
  if (jwt) {
    var payload = decodeJwt(jwt)
    var email = payload.email
    state.auth.setEmail(email)
    state.auth.setAuthToken(jwt)

    query.delete(REDIRECT_PARAM)
    window.history.replaceState({}, '', `?${query.toString()}`)

    _onLogin(null, { data: { authToken: jwt, email } })
  }

  return el

  function render (state) {
    var linkTypes = ['signup', 'changePasswordRequest']
    var links = createLinks(linkTypes, state.links, defaults.links)

    var googleSignInUrl = state.googleSignIn
      ? `${state.auth.googleSignInUrl}?redirectUrl=${encodeURIComponent(
          window.location.href
        )}&redirectParam=${REDIRECT_PARAM}`
      : null

    return Box(
      {
        title: state.titles.login || state.title,
        fields: state.fields,
        links: links,
        styles: state.styles,
        submitText: state.submitText,
        googleSignInUrl
      },
      onsubmit
    )
  }

  function onsubmit (data, cb) {
    state.auth.login(data, function (err, result) {
      if (err) {
        // Check if auto-retry is enabled and this error should trigger signup
        if (state.autoRetry && autoRetry.shouldRetryAsSignup(err)) {
          return performSignupRetry(data, cb, err)
        }
        return cb(err)
      }

      _onLogin(null, result)
    })
  }

  function performSignupRetry(formData, cb, originalErr) {
    // Create signup data with form data + auto-retry defaults
    var signupData = xtend(formData, state.autoRetryDefaults)
    
    // Show user what's happening - this creates a "fake error" to update UI
    var retryError = new Error('Email not found, creating account instead...')
    retryError.isRetrying = true
    setTimeout(function() {
      cb(retryError)
    }, 100)
    
    // Small delay then attempt signup
    setTimeout(function() {
      state.auth.signup(signupData, function (err, result) {
        if (err) {
          // If signup also fails, show the signup error
          return cb(err)
        }
        
        // Success! Call the original login callback
        _onLogin(null, result)
      })
    }, 1000)
  }
}

function decodeJwt (token) {
  var parts = token.split('.')
  var payload = atob(parts[1].replace(/_/g, '/').replace(/-/g, '+'))
  return JSON.parse(payload)
}