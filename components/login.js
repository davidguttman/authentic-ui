var xtend = require('xtend')

var Box = require('./shared/box')
var createLinks = require('./shared/create-links')

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
  return el

  function render (state) {
    var linkTypes = ['signup', 'changePasswordRequest']
    var links = createLinks(linkTypes, state.links, defaults.links)

    return Box({
      title: state.titles.login || state.title,
      fields: state.fields,
      links: links,
      styles: state.styles,
      submitText: state.submitText
    }, onsubmit)
  }

  function onsubmit (data, cb) {
    state.auth.login(data, function (err, result) {
      if (err) return cb(err)

      _onLogin(null, result)
    })
  }
}
