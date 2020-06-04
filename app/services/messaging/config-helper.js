function onSenderError (context, name) {
  const senderError = context.sender && context.sender.error
  if (senderError) {
    console.error(`sender error for ${name}`, senderError)
  }
}

function onSessionError (context, name) {
  const sessionError = context.session && context.session.error
  if (sessionError) {
    console.error(`session error for ${name}`, sessionError)
  }
}

function getSenderConfig (name, config) {
  return {
    name,
    target: { address: config.address },
    onError: context => onSenderError(context, name),
    onSessionError: context => onSessionError(context, name),
    sendTimeoutInSeconds: config.sendTimeoutInSeconds
  }
}

module.exports = {
  getSenderConfig
}
