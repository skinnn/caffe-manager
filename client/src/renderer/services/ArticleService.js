import Api from '@/services/Api'
// import axios from 'axios'

export default {
  createArticle(formData) {
    return Api().post('admin/article/create', formData)
  },
  getArticlesByStorageId(storageId) {
    return Api().get(`admin/storage/${storageId}/articles`)
  },
  getArticleById(articleId) {
    return Api().get(`admin/storage/${articleId}`)
  },
  saveArticle(article) {
    return Api().put(`article/${article._id}`, article)
  },
  deleteArticle(articleId) {
    return Api().delete(`article/${articleId}`)
  },
  upload(body) {
    // querystring for form-data
    return Api().post('upload/image', body)
  }
}
