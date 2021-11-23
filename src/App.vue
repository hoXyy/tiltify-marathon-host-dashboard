<template>
  <v-app>
    <top-bar v-on:refresh="refreshData" />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TopBar from "./components/TopBar.vue";
import { mapMutations } from "vuex";
import tiltifyapi from "./tiltify";
import database from "./firebase";
import { ref, onValue } from "firebase/database";

export default {
  name: "App",
  components: {
    TopBar,
  },
  methods: {
    ...mapMutations([
      "setTotal",
      "setCampaignName",
      "setInitialDonationList",
      "setCampaignSlug",
      "setRefreshState",
      "setReadDonations",
    ]),
    refreshData() {
      console.log("refreshing data");
      this.setRefreshState(true);
      // get new total amount
      tiltifyapi.Campaigns.get(
        process.env.VUE_APP_TILTIFY_CAMPAIGN_ID,
        (data) => {
          console.log("New total acquired");
          this.setTotal(data.amountRaised);
        }
      );
      // get 10 most recent donations
      tiltifyapi.Campaigns.getRecentDonations(
        process.env.VUE_APP_TILTIFY_CAMPAIGN_ID,
        (data) => {
          for (let i = 0; i < data.length; i++) {
            if (
              this.$store.state.donations.some(
                (donation) => donation.id === data[i].id
              )
            ) {
              console.log(
                `Donation with id ${data[i].id} is already in the vuex store.`
              );
              continue;
            } else {
              this.$store.state.donations.push(data[i]);
              console.log(
                `Added new donation with id ${data[i].id} to the vuex store.`
              );
            }
          }
        }
      );
      setTimeout(() => {
        this.setRefreshState(false);
      }, 3000);
    },
  },
  mounted() {
    // get basic campaign info
    tiltifyapi.Campaigns.get(
      process.env.VUE_APP_TILTIFY_CAMPAIGN_ID,
      (data) => {
        this.setCampaignName(data.name);
        this.setCampaignSlug(data.slug);
        this.setTotal(data.amountRaised);
      }
    );
    // get all donations on initial load
    tiltifyapi.Campaigns.getDonations(
      process.env.VUE_APP_TILTIFY_CAMPAIGN_ID,
      (data) => {
        this.setInitialDonationList(data);
      }
    );
    // get all read donations from firebase DB
    const readDonationsRef = ref(
      database,
      `${process.env.VUE_APP_TILTIFY_CAMPAIGN_ID}`
    );
    onValue(readDonationsRef, (snapshot) => {
      const data = snapshot.val();
      // everything dies if the value of readDonations is null so just add an empty object if that's the case
      if (data === null) {
        this.setReadDonations({});
      } else {
        this.setReadDonations(data);
      }
    });
  },
};
</script>
