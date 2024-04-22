import { axios } from '../index.js'

export default {
  getParkingCongestionRates(location) {
    return axios.$get(`/api/v1/parkings/${location.id}/congestion_rates?day_type=${location.day_type}`)
  }
}
