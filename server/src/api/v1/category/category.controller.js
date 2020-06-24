const Controller = require('../../../lib/Controller')
const Category = require('./category.model')
const CategoryJSONSchema = require('./category.schema.json')

// TODO: Add support for creating category attachment (category_image)
class CategoryController extends Controller {

	// Create category
	static async createCategory(req, res, next) {
		try {
			const error = Controller.validateToSchema(CategoryJSONSchema, req.body)
			if (error) {
				let err = new Error(error); err.name = 'BadRequestError'; throw err
			}

			const query = { name: req.body.name }
			const exist = await Category.findOne(query)
			if (exist && exist.length >= 1) {
				return res.status(400).json({ message: `Category with this name already exist. Name: ${req.body.name}` })
			}


			let newCategory = new Category(req.body)
			newCategory.user_id = req.user.id

			const savedCategory = await newCategory.save()

			return res.status(201).json({ category: savedCategory })
		} catch (err) {
			return next(err)
		}
	}

	// Get category by id
	static async getCategoryById(req, res, next) {
		try {
			const id = req.params.id

			const category = await Category.findById(id)
				.select(req.queryParsed.fields)
				.populate(req.queryParsed.include)

			return res.status(200).json({ category: category })
		} catch (err) {
			return next(err)
		}
	}

	// Update category by id
	static async updateCategoryById(req, res, next) {
		try {
			const query = { _id: req.params.id }
			const options = { new: true }

			const modifiedSchema = CategoryJSONSchema
			// modifiedSchema.required = []
			const error = Controller.validateToSchema(modifiedSchema, req.body)
			if (error) {
				let err = new Error(error); err.name = 'BadRequestError'; throw err
			}

			const updatedCategory = await Category
				.findOneAndUpdate(query, req.body, options)
				.populate(req.queryParsed.include)

			if (!updatedCategory) {
				let err = new Error('Category with this id does not exist'); err.name = 'BadRequestError'; throw err
			}

			return res.status(200).json({ category: updatedCategory })
		} catch (err) {
			return next(err)
		}
	}

	// Delete category by id
	static async deleteCategoryById(req, res, next) {
		try {
			const id = req.params.id
			// TODO: Also delete associated attachments and files (category_image)
			const category = await Category.findByIdAndDelete(id)
			if (!category) {
				let err = new Error('Category with this id does not exist'); err.name = 'BadRequestError'; throw err
			}

			return res.status(200).json({ message: 'Category deleted' })
		} catch (err) {
			return next(err)
		}
	}

	// // TODO: Refactor
	// // Get Article Subgroups from the Main Storage/s
	// static async getCategoriesFromMainStorages(req, res, next) {
	// 	try {
	// 		const getMainStorageIds = async() => {
	// 			const query = { type: 'Main' }
	// 			let storages = await Storage.find(query)
	// 			if (storages.length > 0) {
	// 				let ids = []
	// 				storages.forEach((storage) => {
	// 					ids.push(storage.id)
	// 				})
	// 				return ids
	// 			} else {
	// 				return res.status(400).json({
	// 					noMainStorages: true,
	// 					error: `There are no Main storages.`
	// 				})
	// 			}
	// 		}

	// 		const storageIds = await getMainStorageIds()

	// 		const getAllCategories = async () => {
	// 			let allSubgroups = []
	// 			for (let i = 0; i < storageIds.length; i++) {
	// 				let mainStorageId = { inWhichStorage: storageIds[i] }
	// 				let subgroups = await ArticleCategory.find(mainStorageId)
	// 				if (subgroups.length > 0) {
	// 					subgroups.forEach((subgroup) => {
	// 						allSubgroups.push(subgroup)
	// 					})
	// 				} else {
	// 					console.log(`\nNo Subgroups in storage: ${storageIds[i]}\n`)
	// 				}
	// 			}
	// 			console.log(`Total number of found subgrups: ${allSubgroups.length}\n` + allSubgroups)
	// 			return allSubgroups
	// 		}

	// 		const result = await getAllCategories()
	// 		return res.status(200).json({
	// 			subgroups: result
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// // Get Article Subgroups by storage id
	// async getSubgroupsByStorageId(req, res, next) {
	// 	try {
	// 		let query = { inWhichStorage: req.params.storageId }
	// 		await ArticleCategory.find(query, (err, subgroups) => {
	// 			if (err) throw err
	// 			return res.status(200).json({
	// 				subgroups: subgroups
	// 			})
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

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

}

module.exports = CategoryController