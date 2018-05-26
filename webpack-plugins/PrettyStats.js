const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

module.exports = function PrettyStats() {
  return {
    apply(compiler) {
      compiler.hooks.invalid.tap('compilingMessagePlugin', () => { console.log('Compiling...') })
      compiler.hooks.done.tap('compilingMessagePlugin', (stats) => {
        const rawMessages = stats.toJson({}, true)
        const messages = formatWebpackMessages(rawMessages)
        if (!messages.errors.length && !messages.warnings.length) {
          console.log('Compiled successfully!')
        }
        if (messages.errors.length) {
          console.log('Failed to compile.')
          messages.errors.forEach(e => console.log(e))
          return
        }
        if (messages.warnings.length) {
          console.log('Compiled with warnings.')
          messages.warnings.forEach(w => console.log(w))
        }
      })
    }
  }
}
