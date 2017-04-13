var yo = require('yo-yo')
var xtend = require('xtend')

var Form = require('./form')
var styles = require('./styles')

module.exports = function (state, cb) {
  var defaults = {
    title: 'Log in to Your Account',
    fields: [],
    submitText: 'Submit',
    links: [],
    error: '',
    _status: 'READY'
  }

  state = xtend(defaults, state)
  var el = render(state)
  return el

  function render (state) {
    return yo`<div class=${styles.box}>
      <h4>${state.title}</h4>

      ${ state.message
        ? state.message
        : Form({
          submitText: state.submitText,
          fields: state.fields,
          error: state.error,
          disabled: state._status === 'FETCHING'
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
