import { axios } from '../index.js'

export default {
  getParkingSituations(location_name, from_date, to_date, page, per_page) {
    return axios.$get(`/api/v1/parkings/situations?location_name=${location_name}&from_date=${from_date}&to_date=${to_date}&page=${page}&per_page=${per_page}`)
  }
}
