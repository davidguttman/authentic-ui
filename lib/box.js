var h = require('hyperscript')
var renderForm = require('./form')
var defaultStyles = require('./styles')

module.exports = function renderBox (opts) {
  var styles = opts.styles || defaultStyles
  if (opts.styles === false) styles = {}

  return h('.aui-box', {style: styles.box},
    h('h4.aui-title', {style: styles.title}, opts.title),
    opts.message ? opts.message : renderForm(opts),
    renderLinks(opts.links, styles)
  )
}

function renderLinks (links, styles) {
  if (!links) return ''

  return h('.aui-links', {style: styles.links},
    h('a.aui-link', { href: links[0].href, style: styles.link }, links[0].text),
    ' - ',
    h('a.aui-link', { href: links[1].href, style: styles.link }, links[1].text)
  )
}
