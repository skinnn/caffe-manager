const passport = require('passport')
const Article = require('../models/Article')
const dateHandler = require('./getDate')

module.exports = {

  // Create Article
  async createArticle(req, res) {
    try {
      // console.log('FILE', req.file)
      // console.log('BODY', req.body)
      let article = new Article()
      article.inStorage = req.body.storageId
      article.name = req.body.articleName
      article.quantity = req.body.articleQuantity
      article.price = req.body.articlePrice

      if (req.file !== undefined && req.file !== '') {
        article.image = req.file.path
        console.log('IMG', article.image)
        console.log('IMG', article.image)
        console.log('IMG', article.image)
        console.log('IMG', article.image)
      } else {
        article.image = ''
      }
      // Check if the name is typed and create article in the db
      if (article.name !== '') {
        article.save(function(err) {
          if (err) {
            res.status(500).send({
              error: 'A database error has occurred trying to save the article. Please try again.'
            })
          } else {
            return res.send({
              created: true,
              success: 'Article was successfully createad.'
            })
          }
        })
      } else {
        res.status(400).send({
          error: 'Article must have a name.'
        })
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to create the storage.'
      })
    }
  },

  // Get All Articles
  async getArticlesByStorageId(req, res) {
    try {
      let storageId = { inStorage: req.params.storageId }
      await Article.find(storageId, function(err, articles) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to find articles. Please try again.'
          })
        } else {
          res.send({
            articles: articles
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the list of articles.'
      })
    }
  },

  // Get Article by id
  async getArticleById(req, res) {
    try {
      console.log('hit')
      let query = req.params.articleId
      await Article.getArticleById(query, function(err, article) {
        if (err) {
          console.log(err)
        } else {
          console.log('article found')
          res.send({
            article: article
          })
        }
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to get the article data.'
      })
    }
  },

  // Update Article by id
  async saveArticle(req, res) {
    try {
      let query = {_id: req.params.articleId}

      let article = {}
      article.name = req.body.name
      article.quantity = req.body.quantity
      article.price = req.body.price
      article.updated_date = dateHandler.getCurrentTime()
      if (article.name !== '' && article.quantity !== '' && article.quantity !== 0 && article.price !== '' && article.price !== 0) {
        await Article.findOneAndUpdate(query, article, { upsert: true, new: true }, function(err, article) {
          if (err) {
            console.log(err)
          } else {
            res.send({
              saved: true,
              article: article,
              success: 'Article saved successfully.'
            })
          }
        })
      } else {
        res.status(500).send({
          error: 'Please fill out all the fields with valid information.'
        })
      }
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to update the storage data.'
      })
    }
  },

  // Delete Article
  async deleteArticle(req, res) {
    try {
      let query = {_id: req.params.articleId}
      // let img = req.body.imgPath
      // let dirPath = process.cwd()
      // let fullImgPath = dirPath + '\\' + img
      // console.log(fullImgPath)

      await Article.remove(query, function(err) {
        if (err) {
          console.log(err)
        }
        // TODO: Delete article image
        console.log('Article deleted successfully!')
        res.send({
          deleted: true,
          success: 'Article deleted.'
        })
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to delete the article.'
      })
    }
  }

} /* Module exports */
