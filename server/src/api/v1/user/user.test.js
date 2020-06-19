const expect = require('chai').expect

// API
const api = require('../../../lib/tests').api

// Test helpers
const { userKeys } = require('../../../lib/tests').constants
const { rootUser, user } = require('../../../lib/tests').users

/**
 * Tests
 * ============================================================
 */

describe('*********** User ***********', () => {

	describe('GET /user', () => {
		it('(root) should respond with an array of users (200)', async () => {
			const res = await rootUser
				.get('/user')
			expect(res.status).to.equal(200)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res.body).to.have.property('users').and.to.be.an('array')
			expect(res.body.users[0]).to.have.all.keys(userKeys)
		})
	
		it('(root) should respond with ONLY one user containing ONLY "id" and "files" fields (200)', async () => {
			const res = await rootUser
				.get('/user')
				.query({ limit: 1, fields:{ id: true }, include: 'files'})

			expect(res.status).to.equal(200)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res.body).to.have.property('users').and.to.be.an('array').to.have.lengthOf(1)
			expect(res.body.users[0]).to.have.all.keys('id', 'files')
		})

		it('(root) should respond with an array of ONLY users (roles: "user") sorted by name=ASC', async () => {
			const res = await rootUser
				.get('/user')
				.query({ sort: { name: 'asc'}, match: { roles: 'user' } })
			expect(res.status).to.equal(200)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res.body).to.have.property('users').and.to.be.an('array')
			expect(res.body.users).to.satisfy((users) => { 
				return users.every((user) => expect(user).to.have.all.keys(userKeys))
			})
		})

		it('(user) should fail getting an array of users with forbidden message (403)', async () => {
			const res = await user
				.get('/user')
				.query({ fields:{ id: true }, include: 'files'  })
			expect(res.status).to.equal(403)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res.body).to.not.have.property('users')
		})
	})
	
	describe('GET /user/login-list', () => {
		it('(unauthenticated) should return array of users, with only username and name properties (200)', async () => {
			const res = await api.get('/user/login-list')
			expect(res).to.have.status(200)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res.body).to.have.property('users').and.to.be.an('array')
			expect(res.body.users).to.satisfy((users) => { 
				return users.every((user) => expect(user).to.have.all.keys('username', 'name'))
			})
			// res.body.users.every(i => expect(i).to.have.all.keys('username', 'name'))
			// expect(res.body.users).to.satisfy((users) => { 
			// 	return users.every((user) => expect(user).to.have.all.keys('username', 'name'))
			// })
		})
	})

})
