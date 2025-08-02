/* global URLSearchParams, atob */
var xtend = require('xtend')

var Box = require('./shared/box')
var createLinks = require('./shared/create-links')

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
    var queryString = query.toString()
    window.history.replaceState({}, '', queryString ? `?${queryString}` : window.location.pathname)

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
      if (err) return cb(err)

      _onLogin(null, result)
    })
  }
}

function decodeJwt (token) {
  var parts = token.split('.')
  var payload = atob(parts[1].replace(/_/g, '/').replace(/-/g, '+'))
  return JSON.parse(payload)
}
