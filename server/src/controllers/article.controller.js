const Article = require('../models/Article')
const helpers = require('../lib/helpers')
const fs = require('fs')

module.exports = {

	// Create Article
	async createArticle(req, res, next) {
		try {
			let article = new Article()
			article.name = req.body.articleName
			article.quantity = req.body.articleQuantity
			article.price = req.body.articlePrice
			article.retail_price = req.body.articleRetailPrice
			// Storage and Subgroup data
			article.inStorage = req.body.storageId
			article.subgroup_name = req.body.subgroupName
			article.subgroup_id = req.body.subgroupId

			// TODO: File upload with /file endpoint
			// If image is added create image path
			if (req.file !== undefined && req.file !== '') {
				article.image = req.file.path
				// console.log('IMG', article.image)
			} else {
				article.image = ''
			}

			// TODO: Validation with Joi
			// Check if the name is typed and create article in the db
			if (article.name !== '' && article.quantity !== '' && article.quantity !== 0) {
				await article.save((err) => {
					if (err) throw err
						
					return res.status(201).json({
						created: true,
						success: 'Article was successfully created.'
					})
				})
			} else {
				res.status(400).json({
					error: 'Article must have a name, quantity and price.'
				})
			}
		} catch (err) {
			return next(err)
		}
	},

	// Get Articles by storage id
	async getArticlesByStorageId(req, res, next) {
		try {
			let query = { inStorage: req.params.storageId }
			await Article.find(query, (err, articles) => {
				if (err) throw err

				return res.status(200).json({
					articles: articles
				})
			})
			// await Article
			//   .find(query)
			//   // .sort()
			//   .limit(20)
			//   .exec((err, articles) => {
			//     if (err) {
			//       console.log(err)
			//     }
			//     res.json({
			//       articles: articles
			//     })
			//   })
		} catch (err) {
			return next(err)
		}
	},

	// Get Article by id
	async getArticleById(req, res, next) {
		try {
			let query = req.params.articleId
			await Article.getArticleById(query, (err, article) => {
				if (err) throw err

				return res.status(200).json({
					article: article
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Get all Articles
	async getAllArticles(req, res, next) {
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
	},

	// Get Articles from selected Subgroup
	async getArticlesFromSubgroup(req, res, next) {
		try {
			let query = { subgroup_id: req.params.subgroupId }
			await Article.find(query, (err, articles) => {
				if (err) throw err
				return res.status(200).json({
					articles: articles
				})
			})
		} catch (err) {
			return next(err)
		}
	},

	// Update Article by id
	async saveArticle(req, res, next) {
		try {
			let query = {_id: req.params.articleId}
			let options = { upsert: true, new: true }

			let article = {}
			article.name = req.body.articleName
			article.quantity = req.body.articleQuantity
			article.price = req.body.articlePrice
			article.retail_price = req.body.articleRetailPrice
			article.updated_date = helpers.getCurrentTime()

			// File upload with /file endpoint
			// If image is changed update the image path
			if (req.file !== undefined && req.file !== '') {
				// TODO: If there is previous article image delete it from the images folder
				article.image = req.file.path
			}

			// TODO: Validation with Joi
			// If fields are not empty save article
			if (article.name !== '' && article.quantity !== '' && article.quantity !== 0 && article.price !== '' && article.price !== 0) {
				await Article.findOneAndUpdate(query, article, options, (err, article) => {
					if (err) {
						res.status(500).json({
							error: 'A database error has occurred trying to update the article. Please try again.'
						})
					} else {
						res.json({
							saved: true,
							article: article,
							success: 'Article updated successfully.'
						})
					}
				})
			} else {
				return res.status(500).json({
					error: 'Article must have a name, quantity and price.'
				})
			}
		} catch (err) {
			return next(err)
		}
	},

	// Delete Article
	async deleteArticle(req, res, next) {
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

} /* Module exports */