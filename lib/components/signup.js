var yo = require('yo-yo')
var xtend = require('xtend')

var Box = require('./box')

module.exports = function signup (auth, state, onSignup) {
  state = state || {}
  if (!state.subject) throw new Error('subject is required')
  if (!state.confirmUrl) throw new Error('confirmUrl is required')

  var defaults = {
    confirmUrl: null,
    from: null,
    subject: null,
    title: 'Create Your Account',
    submitText: 'Sign Up',
    successTitle: 'Thanks!',
    successMessage: 'Signup complete! Check your email to continue.',
    fields: [
      { name: 'email', placeholder: 'Email' },
      { name: 'password', placeholder: 'Password', type: 'password' }
    ],
    links: [
      {text: 'Log In', href: '#/login'},
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
      submitText: state.submitText,
      links: state.links
    }, onsubmit)
  }

  function onsubmit (data, cb) {
    var opts = xtend(data, {
      confirmUrl: state.confirmUrl,
      from: state.from,
      subject: state.subject
    })

    auth.signup(opts, function (err, result) {
      if (err) return cb(err)

      if (onSignup) return onSignup(null, result)

      yo.update(el, Box({
        title: state.successTitle,
        message: state.successMessage,
        links: state.links
      }))
    })
  }
}
