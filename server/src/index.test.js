// process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const expect = require('chai').expect

const { protocol, host, port, baseApiURL, rootUser: rootCredentials } = require('./config/config')

// API
const apiURL = `${protocol}://${host}:${port}${baseApiURL}`
const api = chai.request(apiURL)
const agent = chai.request.agent(apiURL)

// Constants
const userKeys = ['id', 'roles', 'username', 'password', 'name', 'email', 'phone', 'address', 'files', 'note', 'updated_by', 'updated', 'created', 'created_by']

// TODO: Move to test helpers so we can individually login a root, admin or user

// Login the root user before we run any tests
var rootUser = chai.request.agent(apiURL)
before((done) => {
  rootUser
    .post('/auth/login')
    .send({ username: rootCredentials.username, password: rootCredentials.password })
    .end((err, res) => {
			expect(res.status).to.equal(200)
			expect(res).to.have.cookie('token')
			expect(res.body).to.have.property('user')
			expect(res.body).to.have.property('token')
			done()
			// return rootUser
		})
})

/**
 * Tests
 * ============================================================
 */

describe('POST /auth/login', () => {
	it('should respond with root user data and token, 200', async () => {
		const res = await rootUser
			.post('/auth/login')
			.send({ username: rootCredentials.username, password: rootCredentials.password })
		expect(res.status).to.equal(200)
		expect(res).to.have.cookie('token')
		expect(res.body).to.have.property('user')
		expect(res.body).to.have.property('token')
	})
})

describe('DELETE /auth/login', () => {
	it('should respond with success message, 200', (done) => {
		rootUser
			.delete('/auth/login')
			.send({ username: rootCredentials.username, password: rootCredentials.password })
			.end((err, res) => {
				expect(res.status).to.equal(200)
				expect(res).to.have.header('Content-Type', /json/)

				expect(res.body).to.have.property('message')
				expect(res.body.message).to.equal('Logged out successfully')
				done()
			})
	})
})

describe('GET /user', () => {
	// Addresses 1st bullet point: if the user is logged in we should get a 200 status code
		it('should respond with an array of users, 200', (done) => {
			rootUser.get('/user')
			.end((err, res) => {
				expect(res.status).to.equal(200)
				expect(res).to.have.header('Content-Type', /json/)

				expect(res.body).to.have.property('users')
				expect(res.body.users[0]).to.contain.keys(userKeys)
				done()
			})
		})
	})

describe('GET /user/login-list', () => {
	it('unauthenticated; should return array of users, with only username and name properties, 200', (done) => {
		api
			.get('/user/login-list')
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res).to.have.header('Content-Type', /json/)

				expect(res.body).to.have.property('users')
				// res.body.users.every(i => expect(i).to.contain.keys('username', 'name'))
				expect(res.body.users).to.satisfy((users) => { 
					return users.every((user) => expect(user).to.contain.keys('username', 'name'))
				})
				done()
			})
	})

	it('authenticated; should respond with an array of users, with only username and name properties, 200 ', (done) => {
		rootUser
			.get('/user/login-list')
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.have.property('users')
				done()
			})
	})
})
