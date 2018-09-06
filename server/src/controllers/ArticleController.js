const passport = require('passport')
const Article = require('../models/Article')
const dateHandler = require('./getDate')
const fs = require('fs')

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

      // If image is added create image path
      if (req.file !== undefined && req.file !== '') {
        article.image = req.file.path
        // console.log('IMG', article.image)
      } else {
        article.image = ''
      }
      // Check if the name is typed and create article in the db
      if (article.name !== '') {
        await article.save(function(err) {
          if (err) {
            res.status(500).send({
              error: 'A database error has occurred trying to save the article. Please try again.'
            })
          } else {
            res.send({
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
      // console.log('BODY:', req.body)
      // console.log('FILE:', req.file)
      let query = {_id: req.params.articleId}

      let article = {}
      article.name = req.body.articleName
      article.price = req.body.articlePrice
      article.quantity = req.body.articleQuantity
      article.updated_date = dateHandler.getCurrentTime()

      // If image is changed update the image path
      if (req.file !== undefined && req.file !== '') {
        // TODO: If there is previous article image delete it from the images folder
        article.image = req.file.path
      }

      // If fields are not empty save article
      if (article.name !== '' && article.quantity !== '' && article.price !== '') {
        await Article.findOneAndUpdate(query, article, { upsert: true, new: true }, function(err, article) {
          if (err) {
            console.log(err)
          } else {
            res.send({
              saved: true,
              article: article,
              success: 'Article updated successfully.'
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

      // Get image path
      let img = req.body.imgPath
      // Create full image path so it can be deleted with fs.unlink
      let fullImgPath = ''
      if (img !== '') {
        let dirPath = process.cwd()
        fullImgPath = dirPath + '/' + img
      }

      await Article.remove(query, function(err) {
        if (err) {
          res.status(500).send({
            error: 'A database error has occurred trying to delete the article.'
          })
        }
        if (fullImgPath !== '') {
          fs.unlink(fullImgPath, function(err) {
            if (err) {
              res.status(500).send({
                error: 'An error has occurred trying to delete the image.'
              })
            }
          })
        }
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
