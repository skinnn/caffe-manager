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
  getArticlesFromSubgroup(subgroupId) {
    return Api().get(`admin/subgroup/${subgroupId}/articles`)
  },
  saveArticle(articleFormData, articleId) {
    return Api().put(`article/${articleId}`, articleFormData)
  },
  deleteArticle(articleId, imgPath) {
    return Api().delete(`article/${articleId}`, {data: { imgPath: imgPath }})
  }
}
