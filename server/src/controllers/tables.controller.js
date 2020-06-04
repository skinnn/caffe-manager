const Table = require('../models/Table')

module.exports = {

	// Create Table
	async createTable(req, res, next) {
		try {
			let table = new Table()
			table.number = req.body.number
			table.ownerId = req.body.ownerId
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
	async getTablesByOwnerId(req, res, next) {
		try {
			let ownerIdQuery = { ownerId: req.params.ownerId }
			await Table.find(ownerIdQuery, (err, tables) => {
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
			// console.log(`OWNER: ${ownerId}, TABLE: ${tableIdQuery}`)
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
			// console.log(`OWNER ID: ${req.params.ownerId}`)
			const query = { _id: req.params.tableId }
			const ownerId = req.params.ownerId
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