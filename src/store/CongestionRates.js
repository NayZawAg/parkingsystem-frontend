import ParkingCongestionRateApi from '~/plugins/axios/parking/congestion_rates'

export const state = () => ({
  congestion_rates:[],
  status: '',
  error: {}
})

export const getters = {
  congestion_rates(state) {
    return state.congestion_rates
  },
  status(state) {
    return state.status
  },
  error(state) {
    return state.error
  }
}

export const mutations = {
  setCongestionRates(state, congestion_rates) {
    state.congestion_rates = congestion_rates
  },
  setStatus(state, status) {
    state.status = status
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async getCongestionRates(Context, location) {
    await ParkingCongestionRateApi.getParkingCongestionRates(location)
      .then((response) => {
        Context.commit('setCongestionRates', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  }
}