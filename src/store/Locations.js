import ParkingLocationApi from '~/plugins/axios/parking/locations'

export const state = () => ({
  locations:[],
  status: '',
  error: {}
})

export const getters = {
  locations(state) {
    return state.locations
  },
  status(state) {
    return state.status
  },
  error(state) {
    return state.error
  }
}

export const mutations = {
  setLocations(state, locations) {
    state.locations = locations
  },
  setStatus(state, status) {
    state.status = status
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async getLocations(Context) {
    await ParkingLocationApi.getParkingLocations()
      .then((response) => {
        Context.commit('setLocations', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  }
}