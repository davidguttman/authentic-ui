var h = require('hyperscript')
var Authentic = require('authentic-client')
var xtend = require('xtend')
var Wildemitter = require('wildemitter')

var renderBox = require('./box')
var login = require('./components/login')
var signup = require('./components/signup')
var changePassword = require('./components/change-password')
var changePasswordRequest = require('./components/change-password-request')

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

  this.login = login.bind(null, this.auth)
  this.signup = signup.bind(null, this.auth)
  this.changePassword = changePassword.bind(null, this.auth)
  this.changePasswordRequest = changePasswordRequest.bind(null, this.auth)
}

Wildemitter.mixin(AuthenticUI)

AuthenticUI.prototype.confirm = confirm
AuthenticUI.prototype.logout = function () { this.auth.logout() }
AuthenticUI.prototype.authToken = function () { return this.auth.authToken }
AuthenticUI.prototype._set = set
AuthenticUI.prototype._get = get

function confirm (opts, cb) {
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

function set (key, val) {
  var lsKey = keyPrefix + key
  if (typeof val !== 'undefined' && val !== null) {
    ls.setItem(lsKey, JSON.stringify(val))
  } else {
    ls.removeItem(lsKey)
  }
  this.emit(key, val)
  return val
}

function get (key) {
  var lsKey = keyPrefix + key
  var str = ls.getItem(lsKey) || 'null'
  return JSON.parse(str)
}
