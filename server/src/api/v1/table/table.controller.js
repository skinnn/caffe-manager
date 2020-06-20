const Table = require('../models/Table')

module.exports = {

	// Create Table
	async createTable(req, res, next) {
		try {
			let table = new Table()
			table.number = req.body.number
			table.user_id = req.body.user_id
			// TODO: Do validation with Joi
			if (table.number !== '' && table.number !== undefined) {
				await table.save((err) => {
					if (err) throw err
					return res.json({
						created: true,
						success: 'Table was successfully created.'
					})
				})
			} else {
				return res.status(400).json({
					info: 'Table not specified.'
				})
			}
		} catch (err) {
			return next(err)
		}
	},

	// Get Tables by owner id
	async getTablesByuser_id(req, res, next) {
		try {
			let user_idQuery = { user_id: req.params.user_id }
			await Table.find(user_idQuery, (err, tables) => {
				if (err) throw err
				return res.status(200).json({
					tables: tables
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Get Table by id
	async getTable(req, res, next) {
		try {
			let query = { _id: req.params.tableId }
			// console.log(`OWNER: ${user_id}, TABLE: ${tableIdQuery}`)
			await Table.findOne(query, (err, table) => {
				if (err) throw err
				return res.status(200).json({
					table: table
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Update Table by id
	async saveTable(req, res, next) {
		try {
		} catch (err) {
			return next(err)
		}
	},

	// Delete Table
	async deleteTable(req, res, next) {
		try {
			// console.log(`TABLE ID: ${req.params.tableId}`)
			// console.log(`OWNER ID: ${req.params.user_id}`)
			const query = { _id: req.params.tableId }
			const user_id = req.params.user_id
			await Table.deleteOne(query, (err) => {
				if (err) throw err
				return res.status(200).json({
					deleted: true,
					success: 'Table deleted.'
				})
			})
		} catch (err) {
			return next(err)
		}
	}

} /* Module exports */