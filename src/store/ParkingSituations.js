import ParkingSituationsApi from '~/plugins/axios/parking/situations'
export const state = () => ({
  in_count: 0,
  out_count: 0,
  parkings:[],
  parkings_csv: [],
  meta: {},
  status: '',
  error: {}
})

export const getters = {
  in_count(state) {
    return state.in_count
  },
  out_count(state) {
    return state.out_count
  },
  parkings(state) {
    return state.parkings
  },
  parkings_csv(state) {
    return state.parkings_csv
  },
  meta(state) {
    return state.meta
  },
  status(state) {
    return state.status
  },
  error(state) {
    return state.error
  }
}

export const mutations = {
  setInCount(state, in_count) {
    state.in_count = in_count
  },
  setOutCount(state, out_count) {
    state.out_count = out_count
  },
  setParkings(state, results) {
    state.parkings = results
  },
  setParkingsCsv(state, results) {
    state.parkings_csv = results
  },
  setMeta(state, meta) {
    state.meta = meta
  },
  setStatus(state, status) {
    state.status = status
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async getParkings(Context, params) {
    await ParkingSituationsApi.getParkingSituations(params.location_name, params.from_date, params.to_date, params.page, params.per_page)
      .then((response) => {
        Context.commit('setInCount', response.in_count)
        Context.commit('setOutCount', response.out_count)
        Context.commit('setParkings', response.results)
        Context.commit('setMeta', response.meta)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  },
  async getParkingsCsv(Context, params) {
    await ParkingSituationsApi.getParkingSituations(params.location_name, params.from_date, params.to_date, "", "")
      .then((response) => {
        Context.commit('setParkingsCsv', response.results)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  }
}