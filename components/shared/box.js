var yo = require('yo-yo')
var xtend = require('xtend')

var Form = require('./form')
var emptyStyles = require('./styles-empty')
var defaultStyles = require('./styles')

module.exports = function (state, cb) {
  if (!state.styles) state.styles = emptyStyles
  if (state.styles === true) state.styles = defaultStyles

  var defaults = {
    title: 'Log in to Your Account',
    fields: [],
    submitText: 'Submit',
    links: [],
    error: '',
    _status: 'READY',
    styles: defaultStyles
  }

  state = xtend(defaults, state)
  var el = render(state)
  return el

  function render (state) {
    var styles = state.styles

    return yo`<div class=${styles.box}>
      <div class=${styles.title}>${state.title}</div>

      ${ state.message
        ? yo`<div>
            <div class=${styles.message}>${state.message}</div>
            ${!state.error ? ''
              : yo`<div class=${styles.error}>${state.error}</div>
            `}
          </div>`
        : Form({
          submitText: state.submitText,
          fields: state.fields,
          error: state.error,
          disabled: state._status === 'FETCHING',
          styles: styles
        }, onsubmit)
      }

      <div class=${styles.links}>
        ${state.links.map(function (link) {
          return yo`<a
            href=${link.href}
            class=${styles.link}>
            ${link.text}
          </a>`
        }).reduce(function (acc, link, i) {
          if (i) acc.push(' - ')
          acc.push(link)
          return acc
        }, [])}
      </div>
    </div>`
  }

  function onsubmit (data, fields) {
    state._status = 'FETCHING'
    state = xtend(state, {fields: fields})
    yo.update(el, render(state))

    cb(data, function (err) {
      if (err) {
        state.error = err.message
        state._status = 'ERROR'
        return yo.update(el, render(state))
      }

      state._status = 'SUCCESS'
      yo.update(el, render(state))
    })
  }
}
