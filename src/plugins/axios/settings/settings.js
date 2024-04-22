import { axios } from '../index.js'

export default {
  getSettings() {
    return axios.$get('/api/v1/settings')
  },
  updateSettings(setting_data) {
    return axios.$put('/api/v1/settings/update_display_setting',setting_data)
  }
}