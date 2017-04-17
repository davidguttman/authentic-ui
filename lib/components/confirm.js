var yo = require('yo-yo')
var xtend = require('xtend')

var Box = require('./box')

module.exports = function confirm (auth, state, onConfirm) {
  state = state || {}
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
    links: [
      {text: 'Log In', href: '#/login'},
      {text: 'Create Account', href: '#/signup'}
    ]
  }

  state = xtend(defaults, state)

  confirm(onConfirm)

  var el = render(state)
  return el

  function render (state) {
    var title = state[state.confirmState + 'Title']
    var message = state[state.confirmState + 'Message']

    return Box({
      title: title,
      message: message,
      error: state.confirmError,
      links: state.links
    })
  }

  function confirm (next) {
    var opts = {
      email: state.email,
      confirmToken: state.confirmToken
    }

    auth.confirm(opts, function (err, result) {
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
