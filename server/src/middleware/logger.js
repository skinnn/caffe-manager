const logger = (req, res, next) => {
  let date = new Date()

  console.log(
    `\n${req.method} @ ${req.protocol}://${req.get('host')}${req.originalUrl}: ${date.toUTCString()}`
  )
  next()
}

module.exports = logger