import axios from 'axios'

let apiUrl

// TODO: Create config file and load env variables from there

// Set api url depending on the environment
if (process.env.NODE_ENV === 'development') {
	apiUrl = process.env.DEV_URL
} else if (process.env.NODE_ENV === 'production') {
	apiUrl = process.env.PROD_URL
}

/*
	Instance used for sending all requests

	@param {Object} token - Holds token which is
	used to populate the Authorization header
*/

export default (token) => {
	const options = {
		baseURL: apiUrl,
		timeout: 0, // 0 is unlimited timeout
		crossDomain: true
	}

	// If token is passed, add Authorization header
	if (token) {
		options.headers = {
			'Authorization': `Bearer ${token}`
		}
	}

	const instance = axios.create(options)

	// Force logout on user when api sends a response status 403
	// instance.interceptors.response.use(null, responseInterceptor)

	return instance
}

// export default () => {
// 	return axios.create({
// 		baseURL: apiUrl
// 	})
// }
