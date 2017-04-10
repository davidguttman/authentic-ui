var yo = require('yo-yo')
var xtend = require('xtend')

var styles = require('./styles')

module.exports = function (state, cb) {
  var el = render(state)

  return el

  function render (state) {
    return yo`<div>
      <input
        class='${styles.input} ${state.disabled ? styles.disabled : ''}'
        name=${state.name || ''}
        placeholder=${state.placeholder || ''}
        value=${state.value || ''}
        disabled=${state.disabled}
        type=${state.type || ''}
        onchange=${onchange} />
    </div>`
  }

  function onchange (evt) {
    state = xtend(state, {value: evt.target.value})
    yo.update(el, render(state))

    var change = {}
    change[evt.target.name] = evt.target.value
    cb(change)
  }
}
