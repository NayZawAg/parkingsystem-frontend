import { axios } from '../index.js'
import tokenAuthenticator from '/src/plugins/token_authenticator'

export default {
  getChatbotDownload(from_year_month, to_year_month) {
    const params = `from_year_month=${from_year_month}&to_year_month=${to_year_month}`
    const key = process.env.SECRET_TOKEN
    let encryptedSecretKey = ''
    tokenAuthenticator.tokenAuthenticator(params, key, result => {
      encryptedSecretKey = result
    })
    const headers = {'access-token': encryptedSecretKey};
    return axios.$get(`/api/v1/downloads/chatbots?from_year_month=${from_year_month}&to_year_month=${to_year_month}`, {headers: headers})
  },
  getParkingDownload(from_year_month, to_year_month) {
    const params = `from_year_month=${from_year_month}&to_year_month=${to_year_month}`
    const key = process.env.SECRET_TOKEN
    let encryptedSecretKey = ''
    tokenAuthenticator.tokenAuthenticator(params, key, result => {
      encryptedSecretKey = result
    })
    const headers = {'access-token': encryptedSecretKey};
    return axios.$get(`/api/v1/downloads/parkings?from_year_month=${from_year_month}&to_year_month=${to_year_month}`, {headers: headers})
  }
}
