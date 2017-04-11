var yo = require('yo-yo')
var xtend = require('xtend')

var Form = require('./form')
var styles = require('./styles')

module.exports = function login (auth, state, onLogin) {
  if (!onLogin) {
    onLogin = state
    state = {}
  }

  var defaults = {
    title: 'Log in to Your Account',
    fields: [
      {
        name: 'email',
        placeholder: 'Email'
      },
      {
        name: 'password',
        placeholder: 'Password',
        type: 'password'
      }
    ],
    error: '',
    _status: 'READY'
  }

  state = xtend(defaults, state)
  var el = render(state)
  return el

  function render (state) {
    return yo`<div class=${styles.box}>
      <h4>${state.title}</h4>

      ${Form({
        submitText: 'Log In',
        fields: state.fields,
        error: state.error,
        disabled: state._status === 'FETCHING'
      }, onsubmit)}

      <div class=${styles.links}>
        <a
          href='#/signup'
          class=${styles.link}>
          Create Account
        </a>
        -
        <a
          href='#/change-password-request'
          class=${styles.link}>
          Reset Password
        </a>
      </div>
    </div>`
  }

  function onsubmit (data, fields) {
    state._status = 'FETCHING'
    state = xtend(state, {fields: fields})
    yo.update(el, render(state))

    auth.login(data, function (err, result) {
      if (err) {
        state.error = err.message
        state._status = 'ERROR'
        return yo.update(el, render(state))
      }

      state._status = 'SUCCESS'
      yo.update(el, render(state))
      onLogin(null, result)
    })
  }
}
