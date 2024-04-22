import { axios } from '../index.js'

export default {
  getParkingLocations() {
    return axios.$get('/api/v1/parkings/locations')
  }
}
