var yo = require('@dguttman/yo-yo')
var xtend = require('xtend')

var Box = require('./shared/box')
var createLinks = require('./shared/create-links')

module.exports = function confirm (state, onConfirm) {
  if (!state.email) throw new Error('email is required')
  if (!state.confirmToken) throw new Error('confirmToken is required')

  var defaults = {
    email: null,
    confirmToken: null,
    confirmError: '',
    confirmState: 'pending',
    title: 'Set Password',
    pendingTitle: 'Confirming Account',
    pendingMessage: 'Your account is being confirmed. Just a moment...',
    failureTitle: 'Account Confirmation Failed',
    failureMessage: 'Your account could not be confirmed.',
    successTitle: 'Account Confirmed',
    successMessage: 'Your account has been confirmed. Logging you in...',
    links: {
      login: {text: 'Log In', href: '#/login'},
      signup: {text: 'Create Account', href: '#/signup'}
    },
    styles: true
  }

  state = xtend(defaults, state)

  confirm(onConfirm)

  var el = render(state)
  return el

  function render (state) {
    var linkTypes = ['login', 'signup']
    var links = createLinks(linkTypes, state.links, defaults.links)

    var title = state[state.confirmState + 'Title']
    var message = state[state.confirmState + 'Message']

    return Box({
      title: title,
      message: message,
      error: state.confirmError,
      links: links,
      styles: state.styles
    })
  }

  function confirm (next) {
    var opts = {
      email: state.email,
      confirmToken: state.confirmToken
    }

    state.auth.confirm(opts, function (err, result) {
      if (err) {
        state.confirmState = 'failure'
        state.confirmError = err.message
        yo.update(el, render(state))
        return
      }

      if (onConfirm) onConfirm()

      state.confirmState = 'success'
      yo.update(el, render(state))
    })
  }
}
