import Api from '@/services/Api'

export default {
  createArticle(formData) {
    return Api().post('admin/article/create', formData)
  },
  getAllArticles() {
    return Api().get('admin/articles')
  },
  getArticlesByStorageId(storageId) {
    return Api().get(`admin/storage/${storageId}/articles`)
  },
  getArticleById(articleId, storageId) {
    return Api().get(`admin/storage/${storageId}/article/${articleId}`)
  },
  saveArticle(articleFormData, articleId) {
    return Api().put(`article/${articleId}`, articleFormData)
  },
  deleteArticle(articleId, imgPath) {
    return Api().delete(`article/${articleId}`, {data: { imgPath: imgPath }})
  }
}
