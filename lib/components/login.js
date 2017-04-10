var yo = require('yo-yo')
var xtend = require('xtend')

var Field = require('./field')
var styles = require('./styles')

module.exports = function login (auth, state, onLogin) {
  if (!onLogin) {
    onLogin = state
    state = {}
  }

  var defaults = {
    email: '',
    password: '',
    error: '',
    _status: 'READY'
  }

  state = xtend(defaults, state)
  var el = render(state)
  return el

  function render (state) {
    return yo`<div class=${styles.box}>
      <h4>Log in to Your Account</h4>
      ${renderForm(state)}

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

  function renderForm (state) {
    var isDisabled = state._status === 'FETCHING'

    return yo`<form onsubmit=${onsubmit}>
      ${Field({
        name: 'email',
        placeholder: 'Email',
        value: state.email,
        disabled: isDisabled
      }, onchange)}

      ${Field({
        name: 'password',
        placeholder: 'Password',
        value: state.password,
        disabled: isDisabled,
        type: 'password'
      }, onchange)}

      <div class=${styles.error}>
        ${state.error}
      </div>

      <div>
        <button
          class='${styles.submit} ${isDisabled ? styles.disabled : ''}'
          type='submit'
          disabled=${isDisabled} >
          Log In
        </button>
      </div>
    </form>`
  }

  function onchange (evt) {
    state = xtend(state, evt)
    yo.update(el, render(state))
  }

  function onsubmit (evt) {
    evt.preventDefault()

    state._status = 'FETCHING'
    yo.update(el, render(state))

    auth.login(state, function (err, result) {
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
