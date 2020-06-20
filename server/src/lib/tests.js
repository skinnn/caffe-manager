const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = require('chai').expect

const { protocol, host, port, baseApiURL, rootUser: rootCredentials } = require('../config/config')

// API
const apiURL = `${protocol}://${host}:${port}${baseApiURL}`
const api = chai.request(apiURL)

// Constants
const userKeys = ['id', 'roles', 'username', 'password', 'name', 'email', 'phone', 'address', 'files', 'note', 'updated_by', 'updated', 'created', 'created_by']

// TODO: Move to test helpers so we can individually login a root, admin or user

// Login root, user and admin role before running the tests (get token from the cookie)
const rootUser = chai.request.agent(apiURL)
const user = chai.request.agent(apiURL)
const admin = chai.request.agent(apiURL)

// Root
before(async () => {
  const res = await rootUser
    .post('/auth/login')
    .send({ username: rootCredentials.username, password: rootCredentials.password })
	
	expect(res).to.not.have.header('X-Powered-By', /express/)
})

// Admin
before(async () => {
  const res = await admin
    .post('/auth/login')
		.send({ username: 'admin', password: '123123' })
		
	expect(res).to.not.have.header('X-Powered-By', /express/)
})

// User
before(async () => {
  const res = await user
    .post('/auth/login')
		.send({ username: 'jdoe1', password: '123123' })
		
	expect(res).to.not.have.header('X-Powered-By', /express/)
})

module.exports = {
	api: api,
	users: {
		rootUser: rootUser,
		user: user,
		admin: admin
	},
	constants: {
		userKeys: userKeys
	}
}