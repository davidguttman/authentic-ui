var yo = require('@dguttman/yo-yo')
var xtend = require('xtend')

var Box = require('./shared/box')
var createLinks = require('./shared/create-links')

module.exports = function changePasswordRequest (state, onReset) {
  if (!state.subject) throw new Error('subject is required')
  if (!state.changeUrl) throw new Error('changeUrl is required')

  var defaults = {
    changeUrl: null,
    from: null,
    subject: null,
    provide: null,
    title: 'Reset Your Password',
    submitText: 'Send Reset Code',
    successTitle: 'Reset Code Sent!',
    successMessage: 'Check your email for a link to reset your password.',
    fields: [ { placeholder: 'Email', name: 'email' } ],
    links: {
      login: {text: 'Log In', href: '#/login'},
      signup: {text: 'Create Account', href: '#/signup'}
    },
    styles: true
  }

  state = xtend(defaults, state)

  var linkTypes = ['login', 'signup']
  var links = createLinks(linkTypes, state.links, defaults.links)

  var el = render(state)
  return el

  function render (state) {
    return Box({
      title: state.titles.changePasswordRequest || state.title,
      fields: state.fields,
      submitText: state.submitText,
      links: links,
      styles: state.styles
    }, onsubmit)
  }

  function onsubmit (data, next) {
    // UI-specific properties that shouldn't be sent to server
    var uiProps = [
      'title', 'submitText', 'successTitle', 'successMessage',
      'fields', 'links', 'styles', 'titles', 'auth'
    ]

    // Start with form data, then add all non-UI state properties
    var opts = xtend(data, state.provide)
    // Add all state properties except UI-specific ones
    Object.keys(state).forEach(function (key) {
      if (uiProps.indexOf(key) === -1 && state[key] != null) {
        opts[key] = state[key]
      }
    })

    state.auth.changePasswordRequest(opts, function (err, result) {
      if (err) return next(err)

      if (onReset) return onReset(null, result)

      yo.update(el, Box({
        title: state.successTitle,
        message: state.successMessage,
        links: links,
        styles: state.styles
      }))
    })
  }
}
