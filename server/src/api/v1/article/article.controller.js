const Controller = require('../../../lib/Controller')
const Article = require('./article.model')
const ArticleJSONSchema = require('./article.schema.json')

class ArticleController extends Controller {

	// Create Article
	static async createArticle(req, res, next) {
		try {
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
				throw Controller.makeError('BadRequestError', `Article with this name or code already exist. Name: ${req.body.name}, Code: ${req.body.code}`)
			}

			// "minimum": { "$data": "1/purchase_price" }
			// Validate purchase and selling price
			if (req.body.purchase_price > req.body.selling_price) {
				throw Controller.makeError('BadRequestError', `Purchase price (${req.body.purchase_price}) should not be greater than selling price (${req.body.selling_price})`)
			}

			const newArticle = new Article(req.body)
			newArticle.code = req.body.code
			newArticle.user_id = req.user.id

			const createdArticle = await newArticle.save()

			return res.status(200).json({ article: createdArticle})
		} catch (err) {
			return next(err)
		}
	}

	static async testAdd(req, res, next) {
		try {
			const options = { new: true }
			const inc = 0.1
			const data = {
				$inc: {
					selling_price: inc
				}
			}

			const updatedArticle = await Article.updateOne({}, data, options)

			return res.status(200).json({
				article: updatedArticle
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

	// Get Article by id
	static async getArticleById(req, res, next) {
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
	static async getArticles(req, res, next) {
		try {
			await Article.find({}, (err, articles) => {
				if (err) throw err

				return res.status(200).json({
					articles: articles
				})
			})
		} catch (err) {
			return next(err)
		}
	}

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

	// Update Article by id
	static async updateArticle(req, res, next) {
		// Validate purchase and selling price
		if (req.body.purchase_price || req.body.selling_price) {
				
		}
		// try {
		// 	let query = {_id: req.params.articleId}
		// 	let options = { upsert: true, new: true }

		// 	let article = {}
		// 	article.name = req.body.articleName
		// 	article.quantity = req.body.articleQuantity
		// 	article.price = req.body.articlePrice
		// 	article.retail_price = req.body.articleRetailPrice
		// 	article.updated = helpers.getCurrentTime()

		// 	// File upload with /file endpoint
		// 	// If image is changed update the image path
		// 	if (req.file !== undefined && req.file !== '') {
		// 		// TODO: If there is previous article image delete it from the images folder
		// 		article.image = req.file.path
		// 	}

		// 	// TODO: Validation
		// 	// If fields are not empty save article
		// 	if (article.name !== '' && article.quantity !== '' && article.quantity !== 0 && article.price !== '' && article.price !== 0) {
		// 		await Article.findOneAndUpdate(query, article, options, (err, article) => {
		// 			if (err) {
		// 				res.status(500).json({
		// 					error: 'A database error has occurred trying to update the article. Please try again.'
		// 				})
		// 			} else {
		// 				res.json({
		// 					saved: true,
		// 					article: article,
		// 					success: 'Article updated successfully.'
		// 				})
		// 			}
		// 		})
		// 	} else {
		// 		return res.status(500).json({
		// 			error: 'Article must have a name, quantity and price.'
		// 		})
		// 	}
		// } catch (err) {
		// 	return next(err)
		// }
	}

	// Delete Article
	static async deleteArticle(req, res, next) {
		try {
			let query = {_id: req.params.articleId}

			// Get image path
			let img = req.body.imgPath
			// Create full image path so it can be deleted with fs.unlink
			let fullImgPath = ''
			if (img !== '') {
				let dirPath = process.cwd()
				fullImgPath = dirPath + '/' + img
			}

			await Article.deleteOne(query, (err) => {
				if (err) throw err
					
				if (fullImgPath !== '') {
					fs.unlink(fullImgPath, (err) => {
						if (err) throw err
					})
				}
				return res.status(200).json({
					deleted: true,
					success: 'Article deleted.'
				})
			})
		} catch (err) {
			return next(err)
		}
	}

}

module.exports = ArticleController