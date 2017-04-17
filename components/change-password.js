var yo = require('yo-yo')
var xtend = require('xtend')

var Box = require('./shared/box')

module.exports = function changePasswordRequest (auth, state, onReset) {
  state = state || {}
  if (!state.email) throw new Error('email is required')
  if (!state.changeToken) throw new Error('changeToken is required')

  var defaults = {
    email: null,
    changeToken: null,
    title: 'Set Password',
    submitText: 'Set Password',
    successTitle: 'Password Set',
    successMessage: 'Your new password has been set. Logging you in...',
    fields: [ { placeholder: 'Password', name: 'password', type: 'password' } ],
    links: [
      {text: 'Log In', href: '#/login'},
      {text: 'Create Account', href: '#/signup'}
    ]
  }

  state = xtend(defaults, state)

  var el = render(state)
  return el

  function render (state) {
    return Box({
      title: state.title,
      fields: state.fields,
      submitText: state.submitText,
      links: state.links
    }, onsubmit)
  }

  function onsubmit (data, next) {
    var opts = xtend(data, {
      email: state.email,
      changeToken: state.changeToken
    })

    auth.changePassword(opts, function (err, result) {
      if (err) return next(err)

      if (onReset) onReset(null, result)

      yo.update(el, Box({
        title: state.successTitle,
        message: state.successMessage,
        links: state.links
      }))
    })
  }
}
