var Authentic = require('authentic-client')
var xtend = require('xtend')
var Wildemitter = require('wildemitter')

var login = require('./components/login')
var signup = require('./components/signup')
var confirm = require('./components/confirm')
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

  this.get = this.auth.get.bind(this.auth)
  this.post = this.auth.post.bind(this.auth)

  this.login = login.bind(null, this.auth)
  this.logout = this.auth.logout.bind(this.auth)
  this.signup = signup.bind(null, this.auth)
  this.confirm = confirm.bind(null, this.auth)
  this.changePassword = changePassword.bind(null, this.auth)
  this.changePasswordRequest = changePasswordRequest.bind(null, this.auth)
}

Wildemitter.mixin(AuthenticUI)

AuthenticUI.prototype.authToken = function () { return this.auth.authToken }
AuthenticUI.prototype._set = set
AuthenticUI.prototype._get = get

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
