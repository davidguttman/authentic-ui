var tape = require('tape')

var AuthenticUI = require('..')

var aui = AuthenticUI({
  server: 'http://localhost:1338',
  links: {
    login: '#/login-test',
    signup: '#/signup-test',
    changePasswordRequest: '#/change-password-request-test'
  }
})

tape('should be able to sign up', function (t) {
  var opts = {
    confirmUrl: window.location.origin + '#/confirm',
    from: 'Example Signup <example@signup.com>',
    subject: 'Welcome!'
  }

  var form = aui.signup(opts)
  document.body.appendChild(form)

  var links = form.querySelectorAll('a')
  var urls = map(links, function (el) { return el.hash })

  t.deepEqual(urls, [
    '#/login-test',
    '#/change-password-request-test'
  ], 'links should match')

  t.end()
})

function map (list, fn) {
  var arr = []
  for (var i = 0; i < list.length; i++) {
    arr.push(fn(list[i], i))
  }
  return arr
}
