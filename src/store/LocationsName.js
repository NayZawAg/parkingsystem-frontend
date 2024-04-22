import LocationsNameApi from '~/plugins/axios/location/name'
export const state = () => ({
  locations: [],
  locationsDetail: {},
  status: '',
  error: {}
})

export const getters = {
  locations(state) {
    return state.locations
  },
  locationsDetails(state) {
    return state.locationsDetail
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
    let locations_name = [];
    locations_name.push({ "id": 0, "name": "" });
    locations.map((location) => {
      locations_name.push({ "id": location.id, "name": location.name });
    });
    state.locations = locations_name;
  },
  setLocationsDetails(state, locationsDetails) {
    state.locationsDetail = locationsDetails;
  },
  setStatus(state, status) {
    state.status = status
  },
  setError(state, error) {
    state.error = error
  }
}

export const actions = {
  async getName(Context) {
    await LocationsNameApi.getLocationsName()
      .then((response) => {
        Context.commit('setLocations', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  },
  async getNameDetail(Context, id) {
    await LocationsNameApi.getLocationsNameDetail(id)
      .then((response) => {
        Context.commit('setLocationsDetails', response)
        Context.commit('setStatus', 'success')
      })
      .catch(error => {
        Context.commit('setError', error)
        Context.commit('setStatus', 'error')
      })
  },
  async updateLocationNameDetail({ commit }, update_params ) {
    await LocationsNameApi.updateLocationsNameDetail(update_params)
      .then((response) => {
        if (response) {
          commit("setStatus", "success");
        }
      })
      .catch((error) => {
        commit("setError", error);
        commit("setStatus", "error");
      });
  },
}