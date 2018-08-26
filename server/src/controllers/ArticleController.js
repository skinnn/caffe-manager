const passport = require('passport')
const Article = require('../models/Article')

module.exports = {

  // Create Article
  async createArticle(req, res) {
    try {
      let article = new Article()
      article.name = req.body.name
      article.quantity = req.body.quantity
      article.inStorage = req.params.storageId
      article.price = req.body.price
      // Check if the name is typed and create article in the db
      if (article.name !== '') {
        await article.save(function(err) {
          if (err) {
            res.status(500).send({
              error: 'A database error has occurred trying to save the article. Please try again.'
            })
          } else {
            res.send({
              saved: true,
              success: 'Article created.'
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
      let query = req.params.articleId
      await Article.getArticleById(query, function(err, article) {
        if (err) {
          console.log(err)
        } else {
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
        console.log('Article deleted successfuly!')
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
