import Api from '@/services/Api'

export default {
  createArticle(formData, article) {
    return Api().post('admin/article/create', formData, article)
  },
  getArticlesByStorageId(storageId) {
    return Api().get(`admin/storage/${storageId}/articles`)
  },
  getArticleById(articleId, storageId) {
    return Api().get(`admin/storage/${storageId}/article/${articleId}`)
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
