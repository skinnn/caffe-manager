import axios from 'axios'

let apiUrl

// TODO: Create config file and load env variables from there

// Set api url depending on the environment
if (process.env.NODE_ENV === 'development') {
  apiUrl = process.env.DEV_URL
} else if (process.env.NODE_ENV === 'production') {
  apiUrl = process.env.PROD_URL
}

export default () => {
  return axios.create({
    baseURL: apiUrl
  })
}
