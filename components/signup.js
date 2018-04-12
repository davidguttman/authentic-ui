var yo = require('yo-yo')
var xtend = require('xtend')

var Box = require('./shared/box')
var createLinks = require('./shared/create-links')

module.exports = function signup (state, onSignup) {
  state = state || {}
  if (!state.subject) throw new Error('subject is required')
  if (!state.confirmUrl) throw new Error('confirmUrl is required')

  var defaults = {
    confirmUrl: null,
    from: null,
    subject: null,
    provide: null,
    title: 'Create Your Account',
    submitText: 'Sign Up',
    successTitle: 'Thanks!',
    successMessage: 'Signup complete! Check your email to continue.',
    fields: [
      { name: 'email', placeholder: 'Email' },
      { name: 'password', placeholder: 'Password', type: 'password' }
    ],
    links: {
      login: {text: 'Log In', href: '#/login'},
      changePasswordRequest: {
        text: 'Reset Password', href: '#/change-password-request'
      }
    },
    styles: true
  }

  state = xtend(defaults, state)

  var linkTypes = ['login', 'changePasswordRequest']
  var links = createLinks(linkTypes, state.links, defaults.links)

  var el = render(state)
  return el

  function render (state) {
    return Box({
      title: state.titles.signup || state.title,
      fields: state.fields,
      submitText: state.submitText,
      links: links,
      styles: state.styles
    }, onsubmit)
  }

  function onsubmit (data, cb) {
    var opts = xtend(data, state.provide, {
      confirmUrl: state.confirmUrl,
      from: state.from,
      subject: state.subject
    })

    state.auth.signup(opts, function (err, result) {
      if (err) return cb(err)

      if (onSignup) return onSignup(null, result)

      yo.update(el, Box({
        title: state.successTitle,
        message: state.successMessage,
        styles: state.styles,
        links: links
      }))
    })
  }
}
