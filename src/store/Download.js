import DownloadApi from '~/plugins/axios/download/download'
export const state = () => ({
  download_csv: [],
  status: '',
  error: {}
})

export const getters = {
  download_csv(state) {
    return state.download_csv
  },
  status(state) {
    return state.status
  },
  error(state) {
    return state.error
  }
}

export const mutations = {
  setDownloadCsv(state, results) {
    state.download_csv = results
  },
  setStatus(state, status) {
    state.status = status
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async getDownloadChatbotCsv(Context, params) {
    await DownloadApi.getChatbotDownload(params.from_year_month, params.to_year_month)
      .then((response) => {
        Context.commit('setDownloadCsv', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  },

  async getDownloadParkingCsv(Context, params) {
    await DownloadApi.getParkingDownload(params.from_year_month, params.to_year_month)
      .then((response) => {
        Context.commit('setDownloadCsv', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  }
}