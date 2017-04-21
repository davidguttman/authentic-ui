module.exports = function createLinks (linkTypes, provided, defaults) {
  var links = []
  linkTypes.forEach(function (type) {
    var link = provided[type]
    if (!link) return
    if (link.href && link.text) return links.push(link)
    if (typeof link === 'string') {
      if (!defaults[type]) return

      return links.push({
        text: defaults[type].text,
        href: link
      })
    }
  })
  return links
}
