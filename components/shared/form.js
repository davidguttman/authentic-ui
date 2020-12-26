var yo = require('@dguttman/yo-yo')
var find = require('lodash.find')
var xtend = require('xtend')

var Field = require('./field')

module.exports = function renderForm (state, cb) {
  var defaults = {
    fields: [],
    error: '',
    disabled: false,
    submitText: 'Submit',
    styles: require('./styles-empty')
  }

  state = xtend(defaults, state)
  var el = render(state)
  return el

  function render (state) {
    var styles = state.styles

    return yo`<form onsubmit=${onsubmit}>
      ${state.fields.map(function (field, i) {
        return Field(xtend(field, {
          disabled: state.disabled,
          styles: styles
        }), onchange)
      })}

      ${!state.error ? ''
        : yo`<div class=${styles.error}>${state.error}</div>
      `}

      <div>
        <button
          class='${styles.submit} ${state.disabled ? styles.disabled : ''}'
          type='submit'
          disabled=${state.disabled} >
          ${state.submitText}
        </button>
      </div>
    </form>`
  }

  function onchange (evt) {
    var fields = state.fields
    var field = find(fields, function (f) { return f.name === evt.name })
    field.value = evt.value
    state = xtend(state, { fields: fields })
    yo.update(el, render(state))
  }

  function onsubmit (evt) {
    evt.preventDefault()
    var data = state.fields.reduce(function (acc, field) {
      acc[field.name] = field.value
      return acc
    }, {})
    cb(data, state.fields)
  }
}
