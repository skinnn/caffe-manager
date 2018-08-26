import Api from '@/services/Api'

export default {
  createArticle(storageId, article) {
    return Api().post(`admin/storage/${storageId}/article/create`, article)
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
  }
}
