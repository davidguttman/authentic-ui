var h = require('hyperscript')
var Authentic = require('authentic-client')
var xtend = require('xtend')
var Wildemitter = require('wildemitter')

var renderBox = require('./box')

var ls = window.localStorage

var keyPrefix = '_aui_'

var AuthenticUI = module.exports = function (opts) {
  if (!(this instanceof AuthenticUI)) return new AuthenticUI(opts)
  this.auth = Authentic(xtend(opts, {
    authToken: this._get('authToken'),
    email: this._get('email')
  }))
  this.auth.on('authToken', this._set.bind(this, 'authToken'))
  this.auth.on('email', this._set.bind(this, 'email'))
  this.links = opts.links || {}
  this.styles = opts.styles

  this.get = this.auth.get.bind(this.auth)
  this.post = this.auth.post.bind(this.auth)
}

Wildemitter.mixin(AuthenticUI)

AuthenticUI.prototype.authToken = function () {
  return this.auth.authToken
}

AuthenticUI.prototype.signup = function (emailOpts, boxOpts) {
  var self = this
  var auth = this.auth

  var fields = [
    {
      label: 'Email',
      property: 'email'
    },
    {
      label: 'Password',
      property: 'password',
      type: 'password'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    title: 'Create Your Account',
    action: 'Sign Up',
    fields: fields,
    onSubmit: onSubmit,
    styles: this.styles,
    links: [
      {href: this.links.login, text: 'Log In'},
      {href: this.links.changePasswordRequest, text: 'Reset Password'}
    ]
  }

  el.appendChild(renderBox(xtend(opts, boxOpts)))

  function onSubmit (formState) {
    auth.signup(xtend(emailOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      el.appendChild(self.renderSignupComplete())
    })
  }

  return el
}

AuthenticUI.prototype.login = function (boxOpts, onLogin) {
  if (typeof boxOpts === 'function') {
    onLogin = boxOpts
    boxOpts = {}
  }

  var auth = this.auth

  var fields = [
    {
      label: 'Email',
      property: 'email'
    },
    {
      label: 'Password',
      property: 'password',
      type: 'password'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    title: 'Log in to Your Account',
    action: 'Log In',
    fields: fields,
    onSubmit: onSubmit,
    styles: this.styles,
    links: [
      {href: this.links.signup, text: 'Create Account'},
      {href: this.links.changePasswordRequest, text: 'Reset Password'}
    ]
  }

  el.appendChild(renderBox(xtend(opts, boxOpts)))

  function onSubmit (formState) {
    auth.login(formState, function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      onLogin(null, result)
    })
  }

  return el
}

AuthenticUI.prototype.changePasswordRequest = function (emailOpts, boxOpts) {
  var self = this
  var auth = this.auth

  var fields = [
    {
      label: 'Email',
      property: 'email'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    title: 'Reset Your Password',
    action: 'Send Reset Code',
    fields: fields,
    onSubmit: onSubmit,
    styles: this.styles,
    links: [
      {href: this.links.login, text: 'Log In'},
      {href: this.links.signup, text: 'Create Account'}
    ]
  }

  el.appendChild(renderBox(xtend(opts, boxOpts)))

  function onSubmit (formState) {
    auth.changePasswordRequest(xtend(emailOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      el.appendChild(self.renderChangePasswordComplete())
    })
  }

  return el
}

AuthenticUI.prototype.changePassword = function (changeOpts, boxOpts, onLogin) {
  if (typeof boxOpts === 'function') {
    onLogin = boxOpts
    boxOpts = {}
  }

  var auth = this.auth

  var fields = [
    {
      label: 'Password',
      property: 'password',
      type: 'password'
    }
  ]

  var el = document.createElement('div')

  var opts = {
    title: 'Set Password',
    action: 'Set Password',
    fields: fields,
    onSubmit: onSubmit,
    links: [
      {href: this.links.login, text: 'Log In'},
      {href: this.links.signup, text: 'Create Account'}
    ]
  }

  el.appendChild(renderBox(xtend(opts, boxOpts)))

  function onSubmit (formState) {
    auth.changePassword(xtend(changeOpts, formState), function (err, result) {
      el.innerHTML = ''
      if (err) {
        opts.error = err.message
        opts.state = formState

        el.appendChild(renderBox(opts))

        return
      }

      el.innerHTML = result.message

      if (!opts.confirmDelay) return onLogin(null, result)

      el.innerHTML = result.message + ' We are now logging you in...'
      setTimeout(onLogin, opts.confirmDelay, null, result)
    })
  }

  return el
}

AuthenticUI.prototype.confirm = function (opts, cb) {
  var self = this
  var el = document.createElement('div')
  el.appendChild(
    renderBox({
      message: h('.message', 'Confirming account...')
    })
  )

  this.auth.confirm(opts, function (err, result) {
    if (err) {
      el.innerHTML = ''
      el.appendChild(
        renderBox({
          message: h('.message', 'Could not confirm account: ' + err.message),
          links: [
            {href: self.links.login, text: 'Log In'},
            {href: self.links.signup, text: 'Create Account'}
          ]
        })
      )
      return cb(err)
    }

    el.innerHTML = ''
    el.appendChild(
      renderBox({
        message: h('.message', result.message)
      })
    )

    if (!opts.confirmDelay) return cb(null, result)

    setTimeout(cb, opts.confirmDelay, null, result)
  })

  return el
}

AuthenticUI.prototype.logout = function () {
  this.auth.logout()
}

AuthenticUI.prototype._set = function (key, val) {
  var lsKey = keyPrefix + key
  if (typeof val !== 'undefined' && val !== null) {
    ls.setItem(lsKey, JSON.stringify(val))
  } else {
    ls.removeItem(lsKey)
  }
  this.emit(key, val)
  return val
}

AuthenticUI.prototype._get = function (key) {
  var lsKey = keyPrefix + key
  var str = ls.getItem(lsKey) || 'null'
  return JSON.parse(str)
}

AuthenticUI.prototype.renderChangePasswordComplete = function () {
  return renderBox({
    message: h('.message', 'Check your email for a link to change your password.'),
    links: [
      {href: this.links.login, text: 'Log In'},
      {href: this.links.signup, text: 'Create Account'}
    ]
  })
}

AuthenticUI.prototype.renderSignupComplete = function () {
  return renderBox({
    message: h('.message', 'Signup complete! Check your email to continue.'),
    links: [
      {href: this.links.login, text: 'Log In'},
      {href: this.links.signup, text: 'Create Account'}
    ]
  })
}
