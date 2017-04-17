var yo = require('yo-yo')
var xtend = require('xtend')

var Box = require('./box')

module.exports = function changePasswordRequest (auth, state, onReset) {
  state = state || {}
  if (!state.subject) throw new Error('subject is required')
  if (!state.changeUrl) throw new Error('changeUrl is required')

  var defaults = {
    changeUrl: null,
    from: null,
    subject: null,
    title: 'Reset Your Password',
    submitText: 'Send Reset Code',
    successTitle: 'Reset Code Sent!',
    successMessage: 'Check your email for a link to reset your password.',
    fields: [ { placeholder: 'Email', name: 'email' } ],
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
      changeUrl: state.changeUrl,
      from: state.from,
      subject: state.subject
    })

    auth.changePasswordRequest(opts, function (err, result) {
      if (err) return next(err)

      if (onReset) return onReset(null, result)

      yo.update(el, Box({
        title: state.successTitle,
        message: state.successMessage,
        links: state.links
      }))
    })
  }
}
