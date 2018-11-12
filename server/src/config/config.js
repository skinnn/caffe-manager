module.exports = {
  port: process.env.PORT || 8080,
  db: {
    uri: 'mongodb://localhost:27017/vue-caffe'
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
