var xtend = require('xtend')
var Authentic = require('authentic-client')
var Wildemitter = require('wildemitter')

var components = {
  login: require('./components/login'),
  signup: require('./components/signup'),
  confirm: require('./components/confirm'),
  changePassword: require('./components/change-password'),
  changePasswordRequest: require('./components/change-password-request')
}

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

  this.googleSignIn = opts.googleSignIn || false
  this.titles = opts.titles || {}
  this.links = opts.links || false
  this.styles = true
  if (opts.styles) this.styles = opts.styles
  if (opts.styles === false) this.styles = false

  // Auto-retry configuration
  this.autoRetry = opts.autoRetry || false
  this.autoRetryDefaults = xtend({
    confirmUrl: (typeof window !== 'undefined' ? 
      window.location.origin + window.location.pathname + '#/confirm' : 
      '#/confirm'),
    subject: 'Welcome! Please confirm your account',
    from: null
  }, opts.autoRetryDefaults || {})

  this.get = this.auth.get.bind(this.auth)
  this.post = this.auth.post.bind(this.auth)
}

Wildemitter.mixin(AuthenticUI)

AuthenticUI.prototype.authToken = function () { return this.auth.authToken }
AuthenticUI.prototype.email = function () { return this.auth.email }
AuthenticUI.prototype._set = set
AuthenticUI.prototype._get = get

AuthenticUI.prototype.logout = function (cb) {
  this.auth.logout()
  if (cb) cb()
}

Object.keys(components).forEach(function (type) {
  AuthenticUI.prototype[type] = function (opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    }

    return components[type](xtend({
      auth: this.auth,
      links: this.links,
      titles: this.titles,
      styles: this.styles,
      googleSignIn: this.googleSignIn,
      autoRetry: this.autoRetry,
      autoRetryDefaults: this.autoRetryDefaults
    }, opts), cb)
  }
})

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
