var xtend = require('xtend')

var Box = require('./shared/box')

module.exports = function login (auth, state, onLogin) {
  if (!onLogin) {
    onLogin = state
    state = {}
  }

  var defaults = {
    title: 'Log in to Your Account',
    fields: [
      { name: 'email', placeholder: 'Email' },
      { name: 'password', placeholder: 'Password', type: 'password' }
    ],
    links: [
      {text: 'Create Account', href: '#/signup'},
      {text: 'Reset Password', href: '#/change-password-request'}
    ]
  }

  state = xtend(defaults, state)
  var el = render(state)
  return el

  function render (state) {
    return Box({
      title: state.title,
      fields: state.fields,
      links: state.links
    }, onsubmit)
  }

  function onsubmit (data, cb) {
    auth.login(data, function (err, result) {
      if (err) return cb(err)

      onLogin(null, result)
    })
  }
}
