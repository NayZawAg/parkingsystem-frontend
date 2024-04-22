import { axios } from '../index.js'

export default {
  getResetParkings() {
    return axios.$get('/api/v1/parkings/resets')
  },

  resetParking(resets) {
    let reset_params = {
      location_id: resets.id,
      total_in_count: resets.current_total_in_count,
      reset_in_count: resets.reset_in_count
    }
    return axios.$post('/api/v1/parkings/create_reset', reset_params)
  }
}