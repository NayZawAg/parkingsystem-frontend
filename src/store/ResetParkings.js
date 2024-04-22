import ParkingResetApi from '~/plugins/axios/parking/resets'

export const state = () => ({
  reset_parkings:[],
  status: '',
  error: {}
})

export const getters = {
  reset_parkings(state) {
    return state.reset_parkings
  },
  status(state) {
    return state.status
  },
  error(state) {
    return state.error
  }
}

export const mutations = {
  setResetParkings(state, reset_parkings) {
    state.reset_parkings = reset_parkings
  },
  setStatus(state, status) {
    state.status = status
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async getResets(Context) {
    await ParkingResetApi.getResetParkings()
      .then((response) => {
        Context.commit('setResetParkings', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  },

  async resetParking(Context, parking_reset) {
    await ParkingResetApi.resetParking(parking_reset)
      .then((response) => {
        Context.commit('setResetParkings', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  }
}