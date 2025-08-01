var AuthenticUI = require('..')

// Create AuthenticUI instance with auto-retry enabled
var aui = AuthenticUI({
  server: 'http://localhost:1337',
  autoRetry: true, // Enable the new auto-retry feature
  autoRetryDefaults: {
    // Customize the defaults for signup when auto-retrying from login
    confirmUrl: window.location.origin + '#/confirm',
    subject: 'Welcome! Your account has been automatically created.',
    from: 'Auto-Retry Demo <demo@example.com>'
  },
  links: {
    signup: '#/signup',
    login: '#/login',
    changePasswordRequest: '#/change-password-request'
  }
})

// Set up demo page
function init() {
  var main = document.createElement('div')
  document.body.appendChild(main)

  var instructions = document.createElement('div')
  instructions.innerHTML = `
    <h2>Auto-Retry Authentication Demo</h2>
    <p><strong>Try these scenarios:</strong></p>
    <ul>
      <li><strong>Login with non-existent email:</strong> Will automatically create account</li>
      <li><strong>Signup with existing email:</strong> Will automatically log you in</li>
    </ul>
    <hr>
  `
  document.body.appendChild(instructions)

  document.body.appendChild(makeLink('Demo Login (with auto-retry)', '#/login'))
  document.body.appendChild(makeLink('Demo Signup (with auto-retry)', '#/signup'))
  document.body.appendChild(makeLink('Protected Area', '#/protected'))
  document.body.appendChild(makeLink('Log Out', '#/logout'))

  window.addEventListener('hashchange', function () { runRoutes(main) })
  runRoutes(main)
}

function runRoutes(el) {
  var appState = window.location.hash.replace('#/', '')
  el.innerHTML = ''

  if (appState === 'signup') return signupRoute(el)
  if (appState === 'protected') return protectedRoute(el)
  if (appState === 'login') return loginRoute(el)
  if (appState === 'logout') return logoutRoute(el)

  return loginRoute(el)
}

function loginRoute(el) {
  if (aui.authToken()) {
    window.location.hash = '/protected'
    return
  }

  console.log('Creating login form with autoRetry enabled')
  var form = aui.login(function (err, result) {
    if (err) return console.error('Login error:', err)
    console.log('Login successful (may have auto-retried as signup):', result)
    window.location.hash = '/protected'
  })
  el.appendChild(form)
}

function signupRoute(el) {
  var opts = {
    confirmUrl: window.location.origin + '#/confirm',
    from: 'Auto-Retry Demo <demo@example.com>',
    subject: 'Welcome to the Auto-Retry Demo!'
  }

  console.log('Creating signup form with autoRetry enabled')
  var form = aui.signup(opts, function (err, result) {
    if (err) return console.error('Signup error:', err)
    console.log('Signup successful (may have auto-retried as login):', result)
    window.location.hash = '/protected'
  })
  el.appendChild(form)
}

function protectedRoute(el) {
  if (aui.authToken()) {
    el.innerHTML = `
      <h3>Protected Area</h3>
      <p>You're logged in! Email: ${aui.email()}</p>
      <p>This worked even if auto-retry was used.</p>
    `
  } else {
    el.innerHTML = 'Not logged in! Redirecting...'
    setTimeout(function () {
      window.location.hash = '/login'
    }, 2000)
  }
}

function logoutRoute(el) {
  aui.logout()
  el.innerHTML = 'You are logged out. Redirecting...'
  setTimeout(function () {
    window.location.hash = '/login'
  }, 2000)
}

function makeLink(text, url) {
  var a = document.createElement('a')
  a.style.margin = '5px'
  a.style.display = 'block'
  a.innerHTML = text
  a.href = url
  return a
}

// Initialize when page loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}