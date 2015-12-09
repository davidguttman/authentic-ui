var h = require('hyperscript')
var defaultStyles = require('./styles')

module.exports = function renderForm (opts) {
  var styles = opts.styles || defaultStyles
  if (opts.styles === false) styles = {}

  var formState = opts.state || {}

  var action = opts.action
  var fields = opts.fields
  var onSubmit = opts.onSubmit

  var fieldEls = fields.map(function (field) {
    return h('div',
      h('input.aui-input.' + field.property, {
        style: styles.input,
        type: field.type,
        value: formState[field.property] || '',
        placeholder: field.label,
        onkeyup: function (evt) {
          formState[field.property] = evt.target.value
        }
      })
    )
  })

  var el = h.apply(null,
    [ 'form.aui-form' ].concat(
      fieldEls,
      [
        h('.aui-error', {style: styles.error}, opts.error),
        h('button.aui-submit', {style: styles.submit},
          { type: 'submit',
            onclick: function (evt) {
              onSubmit(formState)
              evt.preventDefault()
            }
          },
          action || 'Submit'
        )
      ]
    )
  )

  return el
}

