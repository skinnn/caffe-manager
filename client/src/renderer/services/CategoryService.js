import Api from '../services/Api'

export default {
	getCategories() {
		return Api().get('/category')
	}
}
