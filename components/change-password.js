var yo = require('@dguttman/yo-yo')
var xtend = require('xtend')

var Box = require('./shared/box')
var createLinks = require('./shared/create-links')

module.exports = function changePasswordRequest (state, onReset) {
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
    links: {
      login: {text: 'Log In', href: '#/login'},
      signup: {text: 'Create Account', href: '#/signup'}
    },
    styles: true
  }

  state = xtend(defaults, state)

  var linkTypes = ['signup', 'changePasswordRequest']
  var links = createLinks(linkTypes, state.links, defaults.links)

  var el = render(state)
  return el

  function render (state) {
    return Box({
      title: state.title,
      fields: state.fields,
      submitText: state.submitText,
      links: links,
      styles: state.styles
    }, onsubmit)
  }

  function onsubmit (data, next) {
    var opts = xtend(data, {
      email: state.email,
      changeToken: state.changeToken
    })

    state.auth.changePassword(opts, function (err, result) {
      if (err) return next(err)

      if (onReset) onReset(null, result)

      yo.update(el, Box({
        title: state.successTitle,
        message: state.successMessage,
        links: links,
        styles: state.styles
      }))
    })
  }
}
