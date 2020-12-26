var yo = require('@dguttman/yo-yo')
var xtend = require('xtend')

module.exports = function (state, cb) {
  var defaults = {
    styles: require('./styles-empty')
  }

  state = xtend(defaults, state)
  var el = render(state)

  return el

  function render (state) {
    var styles = state.styles

    return yo`<div>
      <input
        class='${styles.input} ${state.disabled ? styles.disabled : ''}'
        name=${state.name || ''}
        placeholder=${state.placeholder || ''}
        value=${state.value || ''}
        disabled=${state.disabled}
        type=${state.type || 'text'}
        onchange=${onchange} />
    </div>`
  }

  function onchange (evt) {
    state = xtend(state, {value: evt.target.value})
    yo.update(el, render(state))

    cb({
      name: evt.target.name,
      value: evt.target.value
    })
  }
}
