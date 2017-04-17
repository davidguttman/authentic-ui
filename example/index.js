var AuthenticUI = require('..')
var qs = require('querystring')

var aui = AuthenticUI({
  server: 'http://localhost:1337',
  links: {
    signup: '#/signup',
    login: '#/login',
    changePasswordRequest: '#/change-password-request'
  }
})

setStyles()
init()

function init () {
  var main = document.createElement('div')
  document.body.appendChild(main)

  document.body.appendChild(makeLink('Protected', '#/protected'))
  document.body.appendChild(makeLink('Log Out', '#/logout'))

  window.addEventListener('hashchange', function () { runRoutes(main) })

  runRoutes(main)
}

function runRoutes (el) {
  var appState = window.location.hash.replace('#/', '')
  el.innerHTML = ''

  if (appState === 'signup') return signupRoute(el)
  if (appState.match(/^confirm/)) return confirmRoute(el)
  if (appState === 'protected') return protectedRoute(el)
  if (appState === 'login') return loginRoute(el)
  if (appState === 'logout') return logoutRoute(el)
  if (appState === 'change-password-request') return changePasswordRequestRoute(el)
  if (appState.match(/^change-password/)) return changePasswordRoute(el)

  return loginRoute(el)
}

function loginRoute (el) {
  if (aui.authToken()) {
    window.location.hash = '/protected'
    return
  }

  var form = aui.login(onLogin)
  el.appendChild(form)
}

function signupRoute (el) {
  var opts = {
    confirmUrl: window.location.origin + '#/confirm',
    from: 'Example Signup <example@signup.com>',
    subject: 'Welcome!'
  }

  var form = aui.signup(opts)
  el.appendChild(form)
}

function confirmRoute (el) {
  var query = qs.parse(window.location.search.slice(1))

  var opts = {
    email: query.email,
    confirmToken: query.confirmToken,
    confirmDelay: 5000
  }

  var conf = aui.confirm(opts, onLogin)
  el.appendChild(conf)
}

function changePasswordRequestRoute (el) {
  var opts = {
    changeUrl: window.location.origin + '#/change-password',
    from: 'Example ChangePassword <example@signup.com>',
    subject: 'Change Your Password!'
  }

  var form = aui.changePasswordRequest(opts)
  el.appendChild(form)
}

function changePasswordRoute (el, appState) {
  var query = qs.parse(window.location.search.slice(1))
  var opts = {
    email: query.email,
    changeToken: query.changeToken
  }

  var conf = aui.changePassword(opts, function () { setTimeout(onLogin, 5000) })
  el.appendChild(conf)
}

function logoutRoute (el) {
  aui.logout()
  el.innerHTML = 'You are logged out. Redirecting...'
  setTimeout(function () {
    window.location.hash = '/login'
  }, 2000)
}

function protectedRoute (el) {
  if (aui.authToken()) {
    el.innerHTML = "You're logged in"
    aui.get('/example/api.json', function (err, resp) {
      if (err) return console.error(err)
      el.innerHTML += '<p><code>' + resp.message + '</code></p>'
    })
  } else {
    el.innerHTML = 'Not logged in! Redirecting...'
    setTimeout(function () {
      window.location.hash = '/login'
    }, 2000)
  }
}

function onLogin (err, result) {
  if (err) return console.error(err)

  window.location.hash = '/protected'
  window.location.search = ''
}

function makeLink (text, url) {
  var a = document.createElement('a')
  a.style.margin = '5px'
  a.innerHTML = text
  a.href = url
  return a
}

function setStyles () {
  document.body.style.background = '#eee'
  document.body.style.fontFamily = 'sans-serif'
  document.body.style.textAlign = 'center'
}
