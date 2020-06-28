import Api from '../services/Api'

export default {
	create(data) {
		return Api().post('/article', data)
	},
	get(query = '') {
		return Api().get(`/article${query}`)
	},
	getByid(id, query = '') {
		return Api().get(`/article/${id}${query}`)
	},
	deleteArticle(id) {
		return Api().delete(`/article/${id}`)
	},

	// Attachments
	uploadArticleAttachment(id, identifier, data) {
		return Api().post(`/article/${id}/attachment?match[identifier]=${identifier}`, data)
	},
	getAttachmentByFileId(id, fileId) {
		const options = { responseType: 'blob' }
		return Api().get(`/article/${id}/attachment/${fileId}`, options)
	}

	// createArticle(formData) {
	// 	return Api().post('/admin/article/create', formData)
	// },
	// getAllArticles() {
	// 	return Api().get('/admin/articles')
	// },
	// getArticlesByStorageId(storageId) {
	// 	return Api().get(`/admin/storage/${storageId}/articles`)
	// },
	// getArticleById(articleId, storageId) {
	// 	return Api().get(`/admin/storage/${storageId}/article/${articleId}`)
	// },
	// getArticlesBySubgroupId(subgroupId) {
	// 	return Api().get(`/admin/subgroup/${subgroupId}/articles`)
	// },
	// saveArticle(articleFormData, articleId) {
	// 	return Api().patch(`/article/${articleId}`, articleFormData)
	// },
	// deleteArticle(articleId, imgPath) {
	// 	return Api().delete(`/article/${articleId}`, {data: { imgPath: imgPath }})
	// }
}
