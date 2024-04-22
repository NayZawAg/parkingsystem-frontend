import { axios } from '../index.js'

export default {
  getLocationsName() {
    return axios.$get('/api/v1/locations')
  },
  getLocationsNameDetail(id) {
    return axios.$get(`/api/v1/locations/${id}`)
  },
  updateLocationsNameDetail(update_params) {
    return axios.$put(`/api/v1/locations/${update_params.id}/update_location_information`,
    { 
      "name" : update_params.name,
      "address": update_params.address, 
      "capacity": update_params.capacity, 
      "related_facilities_events": update_params.related_facilities_events,
    });
  },
}