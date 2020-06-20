const expect = require('chai').expect

const { rootUser: rootCredentials } = require('../../../config/config')


// API
const api = require('../../../lib/tests').api

// Test helpers
const { userKeys } = require('../../../lib/tests').constants
const { rootUser, user } = require('../../../lib/tests').users

/**
 * Tests
 * ============================================================
 */

describe('*********** Authentication ***********', () => {

	describe('POST /auth/login', () => {	

		it('(root) should respond with root user object and token (200)', async () => {
			const res = await rootUser
				.post('/auth/login')
				.send({ username: rootCredentials.username, password: rootCredentials.password })
			expect(res.status).to.equal(200)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res).to.have.cookie('token')
			expect(res.body).to.have.property('user')
				.and.to.be.an('object')
				.and.to.have.all.keys(userKeys)
			expect(res.body.user.roles).to.be.an('array').and.to.eql(['root'])
			expect(res.body).to.have.property('token').and.to.be.an('string')
		})

		it('should fail logging in a non-existant user with a message (401)', async () => {
			const res = await user
				.post('/auth/login')
				.send({ username: 'non-existant-user', password: '101010101' })
			expect(res.status).to.equal(401)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res).to.not.have.cookie('token')
			expect(res.body).to.have.property('message').and.to.equal('Incorrect username or password')
			expect(res.body).to.not.have.property('user')
			expect(res.body).to.not.have.property('token')
		})
	}) /* POST /auth/login */
	
	describe('DELETE /auth/login', () => {

		it('should respond with a success message (200)', async () => {
			const res = await user
				.delete('/auth/login')
			expect(res.status).to.equal(200)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res.body).to.have.property('message').and.to.equal('Logged out successfully')
		})

		it('should fail logging out with an error message (401)', async () => {
			const res = await user
				.delete('/auth/login')
				// .set('Cookie', 'non-valid-token')
				.set('Authorization', 'Bearer non-valid-token')
			expect(res.status).to.equal(401)
			expect(res).to.have.header('Content-Type', /json/)
			expect(res.body).to.have.property('message').and.to.equal('Access denied')
			expect(res.body).to.have.property('name').and.to.equal('UnauthorizedError')
		})
	}) /* DELETE /auth/login */

})