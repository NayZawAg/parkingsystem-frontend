import SettingsApi from "~/plugins/axios/settings/settings";

export const state = () => ({
  displaySettings: [],
  status: "",
  error: {},
});

export const getters = {
  displaySettings(state) {
    return state.displaySettings;
  },
  status(state) {
    return state.status;
  },
  error(state) {
    return state.error;
  },
};

export const mutations = {
  setDisplaySettings(state, settings) {
    state.displaySettings = settings;
  },
  setStatus(state, status) {
    state.status = status;
  },
  setError(state, error) {
    state.error = error;
  },
  updateDisplaysFlag(state, { id, kbn, displayFlag }) {
    const changeItem = state.displaySettings.find(
      (data) => data.id === id && data.kbn === kbn
    );
    changeItem.display_flag = displayFlag;
  },
  updateCrowdLevelDisplay(state, { crowdId, crowdKbn, crowdLevelDisplay }) {
    const changeCrowdItem = state.displaySettings.find(
      (data) => data.id === crowdId && data.kbn === crowdKbn
    );
    changeCrowdItem.crowd_level_display = crowdLevelDisplay;
  },
};

export const actions = {
  async getDisplaySettings(Context) {
    await SettingsApi.getSettings()
      .then((response) => {
        Context.commit("setDisplaySettings", response);
        Context.commit("setStatus", "success");
      })
      .catch((error) => {
        Context.commit("setError", error);
        Context.commit("setStatus", "error");
      });
  },
  updateDisplayFlagItem({ commit }, { id, kbn, displayFlag }) {
    try {
      commit("updateDisplaysFlag", { id, kbn, displayFlag });
      commit("setStatus", "success");
    } catch (error) {
      commit("setError", error);
      commit("setStatus", "error");
    }
  },
  updateCrowdLevelDisplayItem(
    { commit },
    { crowdId, crowdKbn, crowdLevelDisplay }
  ) {
    try {
      commit("updateCrowdLevelDisplay", {
        crowdId,
        crowdKbn,
        crowdLevelDisplay,
      });
      commit("setStatus", "success");
    } catch (error) {
      commit("setError", error);
      commit("setStatus", "error");
    }
  },
  async updateDisplaySettingData({ commit }, setting_data) {
    await SettingsApi.updateSettings(setting_data)
      .then((response) => {
        if (response == true) {
          commit("setStatus", "success");
          location.reload();
        }
      })
      .catch((error) => {
        commit("setError", error);
        commit("setStatus", "error");
      });
  },
};
