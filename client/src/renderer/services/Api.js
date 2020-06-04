import axios from 'axios'

// TODO: Load env variables from the config file

/**
	Axios instance used for sending all the requests from the client.
*/

export default () => {
	const token = localStorage.getItem('token') || null

	const options = {
		baseURL: process.env.NODE_ENV === 'development' ? process.env.DEV_URL : process.env.PROD_URL,
		timeout: 0, // 0 is unlimited timeout
		crossDomain: true
	}

	// If token is found, add Authorization header
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
