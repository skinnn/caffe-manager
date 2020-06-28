const Controller = require('../../../lib/Controller')
const Article = require('./article.model')
const ArticleJSONSchema = require('./article.schema.json')
const AttachmentController = require('./attachment/article.attachment.controller')

class ArticleController extends Controller {

	// Create Article
	static async create(req, res, next) {
		try {
			console.log('GOT: ', req.body)
			const error = Controller.validateToSchema(ArticleJSONSchema, req.body)
			if (error) {
				throw Controller.makeError('BadRequestError', error)
			}

			const query = {
				$or: [
					{ name: req.body.name },
					{ code: req.body.code }
				]
			}
			const exist = await Article.find(query)
			if (exist && exist.length >= 1) {
				const art = exist[0]
				throw Controller.makeError('BadRequestError', `Article with this name or code already exist. Existing article: ${art.name}, Code: ${art.code}`)
			}

			// Validate purchase and selling price
			if (req.body.purchase_price > req.body.selling_price) {
				throw Controller.makeError('BadRequestError', `Purchase price (${req.body.purchase_price}) should not be greater than selling price (${req.body.selling_price})`)
			}

			const newArticle = new Article(req.body)
			newArticle.code = req.body.code
			newArticle.user_id = req.user.id

			const createdArticle = await newArticle.save()

			return res.status(201).json({ article: createdArticle})
		} catch (err) {
			return next(err)
		}
	}

	// static async testAdd(req, res, next) {
	// 	try {
	// 		const options = { new: true }
	// 		const inc = 0.1
	// 		const data = {
	// 			$inc: {
	// 				selling_price: inc
	// 			}
	// 		}

	// 		const updatedArticle = await Article.updateOne({}, data, options)

	// 		return res.status(200).json({
	// 			article: updatedArticle
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// Get Article by id
	static async getById(req, res, next) {
		try {
			let query = req.params.id
			const article = await Article.findById(query)

			return res.status(200).json({
				article: article
			})
		} catch (err) {
			return next(err)
		}
	}

	// Get all Articles
	static async get(req, res, next) {
		try {
			const articles = await Article.find(req.queryParsed.match)
				.populate(req.queryParsed.include)
				.select(req.queryParsed.fields)
				.limit(req.queryParsed.limit)
				.sort(req.queryParsed.sort)
			
			return res.status(200).json({
				articles: articles
			})
		} catch (err) {
			return next(err)
		}
	}

	// Update Article by id
	static async update(req, res, next) {
		try {
			const query = { _id: req.params.id }
			const options = { new: true }
			let data = req.body
			const ctrl = Controller

			// Validate body
			const modifiedSchema = ArticleJSONSchema
			modifiedSchema.required = []
			const error = ctrl.validateToSchema(modifiedSchema, data)
			if (error) throw ctrl.makeError('BadRequestError', error)

			const articleDoc = await Article
				.findOne(query)
			
			if (!articleDoc) {
				throw ctrl.makeError('BadRequestError', `Article with id: ${req.params.id} does not exist`)
			}

			const articleToUpdate = articleDoc.toJSON()

			// If updating only purchase_price
			if (data.purchase_price && !data.selling_price) {
				// console.log(JSON.stringify(articleToUpdate))
				if (articleToUpdate.selling_price < data.purchase_price) {
					throw ctrl.makeError('BadRequestError', `Purchase price (${data.purchase_price}) should not be greater than current selling price (${articleToUpdate.selling_price})`)
				}
			// If updating only selling_price
			} else if (data.selling_price && !data.purchase_price) {
				if (data.selling_price < articleToUpdate.purchase_price) {
					throw ctrl.makeError('BadRequestError', `Selling price (${data.selling_price}) should be greater than current purchase price (${articleToUpdate.purchase_price})`)
				}
			// If both are updating
			} else if (data.selling_price && data.purchase_price) {
				if (data.purchase_price > data.selling_price) {
					throw ctrl.makeError('BadRequestError', `Purchase price (${data.purchase_price}) should not be greater than selling price (${data.selling_price})`)
				}
			}

			data.updated = new Date(Date.now()).toString()
			data.updated_by = req.user.id
			const	updatedArticle = await Article
				.findOneAndUpdate(query, data, options)
				.populate(req.queryParsed.include)

			return res.status(200).json({ article: updatedArticle })
		} catch (err) {
			return next(err)
		}
	}

	// Delete Article by id
	static async delete(req, res, next) {
		try {
			console.log(req.params.id)
			const query = {_id: req.params.id }

			const articleToDelete = await Article.findOne(query)
			if (!articleToDelete) {
				return res.status(404).json({
					message: 'Article not found'
				})
			}

			// if (!req.user.roles.includes('admin')) {
			// 	Controller.validateOwnership(req, articleToDelete)
			// }

			const deletedArticle = await Article.deleteOne(query)
			if (deletedArticle) {
				AttachmentController.deleteAttachments(articleToDelete.files)
			}


			return res.status(200).json({
				message: 'Article deleted'
			})
		} catch (err) {
			return next(err)
		}
	}

	// // Get Articles by storage id
	// static async getArticlesByStorageId(req, res, next) {
	// 	try {
	// 		let query = { storage_id: req.params }
	// 		await Article.find(query, (err, articles) => {
	// 			if (err) throw err

	// 			return res.status(200).json({
	// 				articles: articles
	// 			})
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// // Get Articles from selected Subgroup
	// static async getArticlesFromSubgroup(req, res, next) {
	// 	try {
	// 		let query = { subgroup_id: req.params.subgroupId }
	// 		await Article.find(query, (err, articles) => {
	// 			if (err) throw err
	// 			return res.status(200).json({
	// 				articles: articles
	// 			})
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

	// Delete Article
	// static async deleteArticle(req, res, next) {
	// 	try {
	// 		let query = {_id: req.params.articleId}

	// 		// Get image path
	// 		let img = req.body.imgPath
	// 		// Create full image path so it can be deleted with fs.unlink
	// 		let fullImgPath = ''
	// 		if (img !== '') {
	// 			let dirPath = process.cwd()
	// 			fullImgPath = dirPath + '/' + img
	// 		}

	// 		await Article.deleteOne(query, (err) => {
	// 			if (err) throw err
					
	// 			if (fullImgPath !== '') {
	// 				fs.unlink(fullImgPath, (err) => {
	// 					if (err) throw err
	// 				})
	// 			}
	// 			return res.status(200).json({
	// 				deleted: true,
	// 				success: 'Article deleted.'
	// 			})
	// 		})
	// 	} catch (err) {
	// 		return next(err)
	// 	}
	// }

}

module.exports = ArticleController