var run = require('tape-run')
var browserify = require('browserify')

var createServer = require('./server')

var server = createServer()
server.listen(1338)

browserify(__dirname + '/client.js')
  .bundle()
  .pipe(run())
  // .on('results', console.log)
  .on('end', function () { server.close() })
  .pipe(process.stdout)
