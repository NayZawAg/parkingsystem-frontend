export let axios

export default ({ $axios }) => {
  $axios.defaults.baseURL = process.env.NUXT_ENV_API_URL

  $axios.onError((error) => {
    return Promise.reject(error.response)
  })

  axios = $axios
}
