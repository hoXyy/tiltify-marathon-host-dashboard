import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    campaign: {
      name: "",
      slug: "",
      total: 0,
    },
    donations: [],
    readDonations: {},
    refreshing: false,
  },
  mutations: {
    setTotal(state, amount) {
      state.campaign.total = amount;
    },
    setCampaignName(state, name) {
      state.campaign.name = name;
    },
    setCampaignSlug(state, slug) {
      state.campaign.slug = slug;
    },
    setInitialDonationList(state, donations) {
      state.donations = donations;
    },
    setRefreshState(state, value) {
      state.refreshing = value;
    },
    setReadDonations(state, value) {
      state.readDonations = value;
    },
  },
  actions: {},
  modules: {},
  strict: process.env.NODE_ENV !== "production",
});
