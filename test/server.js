var fs = require('fs')
var http = require('http')
var Authentic = require('authentic-server')

var db = {
  store: {},
  get: function (key, cb) { cb(null, this.store[key]) },
  put: function (key, val, cb) { cb(null, this.store[key] = val) }
}

var auth = Authentic({
  db: db,
  publicKey: fs.readFileSync(__dirname + '/rsa-public.pem'),
  privateKey: fs.readFileSync(__dirname + '/rsa-private.pem'),
  sendEmail: function (opts, cb) { db.store.lastEmail = opts; cb() }
})

module.exports = function () {
  return http.createServer(function (req, res) {
    if (req.url === '/email') return res.end(JSON.stringify(db.store.lastEmail))
    auth(req, res)
  })
}
