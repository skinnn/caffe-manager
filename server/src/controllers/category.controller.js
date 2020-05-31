const ArticleCategory = require('../models/ArticleCategory')
const Storage = require('../models/Storage')

module.exports = {

	// Create article subgroup
	async createArticleCategory(req, res, next) {
		try {
			let subgroup = {}
			subgroup.name = req.body.subgroupName
			subgroup.inWhichStorage = req.params.storageId

			// TODO: Move file upload to POST /file endpoint
			// If image is added create image path
			if (req.file !== undefined && req.file !== '') {
				subgroup.image = req.file.path
				// console.log('IMG', subgroup.image)
			} else {
				subgroup.image = ''
			}

			// Validation
			// TODO: Do all validation with Joi and remove it from the controller
			if (subgroup.name !== '' && subgroup.inWhichStorage !== '') {
				const record = new ArticleCategory(subgroup)
				await record.save((err) => {
					if (err) throw err
					return res.status(201).json({
						saved: true,
						subgroup: subgroup,
						success: 'Subgroup created.'
					})
				})
			} else {
				return res.status(400).json({
					error: 'Please fill out all required fields.'
				})
			}
		} catch (err) {
			return next(err)
		}
	},

	// Get Article Subgroups from the Main Storage/s
	// TODO: Refactor
	async getCategoriesFromMainStorages(req, res, next) {
		try {
			const getMainStorageIds = async() => {
				const query = { type: 'Main' }
				let storages = await Storage.find(query)
				if (storages.length > 0) {
					let ids = []
					storages.forEach((storage) => {
						ids.push(storage._id)
					})
					return ids
				} else {
					return res.status(400).json({
						noMainStorages: true,
						error: `There are no Main storages.`
					})
				}
			}

			const storageIds = await getMainStorageIds()

			const getAllCategories = async () => {
				let allSubgroups = []
				for (let i = 0; i < storageIds.length; i++) {
					let mainStorageId = { inWhichStorage: storageIds[i] }
					let subgroups = await ArticleCategory.find(mainStorageId)
					if (subgroups.length > 0) {
						subgroups.forEach((subgroup) => {
							allSubgroups.push(subgroup)
						})
					} else {
						console.log(`\nNo Subgroups in storage: ${storageIds[i]}\n`)
					}
				}
				console.log(`Total number of found subgrups: ${allSubgroups.length}\n` + allSubgroups)
				return allSubgroups
			}

			const result = await getAllCategories()
			return res.status(200).json({
				subgroups: result
			})
		} catch (err) {
			return next(err)
		}
	},

	// Get Article Subgroups by storage id
	async getSubgroupsByStorageId(req, res, next) {
		try {
			let query = { inWhichStorage: req.params.storageId }
			await ArticleCategory.find(query, (err, subgroups) => {
				if (err) throw err
				return res.status(200).json({
					subgroups: subgroups
				})
			})
		} catch (err) {
			return next(err)
		}
	}

	// // TODO: Update Article Subgroups by id
	// async saveStorage(req, res, next) {
	//   try {
	//     let query = {_id: req.params.storageId}
	//
	//     await Storage.findOneAndUpdate(query, req.body, (err, storage) => {
	//       if (err) throw err
//         return res.status(200).json({
//           storage: storage
//         })
	//     })
	//   } catch (err) {
	//     return next(err)
	//   }
	// }

} /* Module exports */