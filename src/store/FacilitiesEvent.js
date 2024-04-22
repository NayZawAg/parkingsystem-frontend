import FacilitiesEventApi from "~/plugins/axios/facilities/facilities";

export const state = () => ({
  facilities: [],
  facilitiesDetail: {},
  status: "",
  error: {},
});

export const getters = {
  facilities(state) {
    return state.facilities;
  },
  facilitiesDetail(state) {
    return state.facilitiesDetail;
  },

  status(state) {
    return state.status;
  },
  error(state) {
    return state.error;
  },
};

export const mutations = {
  setFacilities(state, facilities) {
    state.facilities = facilities;
  },
  setFacilitiesDetail(state, facilitiesDetail) {
    state.facilitiesDetail = facilitiesDetail;
  },
  setStatus(state, status) {
    state.status = status;
  },
  setError(state, error) {
    state.error = error;
  },
};

export const actions = {
  async getFacilities(Context) {
    await FacilitiesEventApi.getFacilitiesEvent()
      .then((response) => {
        Context.commit("setFacilities", response);
        Context.commit("setStatus", "success");
      })
      .catch((error) => {
        Context.commit("setError", error);
        Context.commit("setStatus", "error");
      });
  },
  async getFacilitiesDetail(Context, id) {
    await FacilitiesEventApi.getFacilitiesEventDetail(id)
      .then((response) => {
        Context.commit("setFacilitiesDetail", response);
        Context.commit("setStatus", "sucess");
      })
      .catch((error) => {
        Context.commit("setError", error);
        Context.commit("setStatus", "error");
      });
  },
  async updateFacilitiesDetail({ commit }, update_params ) {
    await FacilitiesEventApi.updateFacilitiesEventDetail(update_params)
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
};
