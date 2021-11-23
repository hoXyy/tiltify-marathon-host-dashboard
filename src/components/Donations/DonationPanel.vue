<template>
  <div
    id="donations"
    style="height: 90vh; width: 800px; display: flex; flex-direction: column"
    class="rounded-lg elevation-6"
  >
    <h3
      style="width: 100%; text-align: center; position: sticky; color: white"
      class="black pa-1 rounded-tl-lg rounded-tr-lg"
    >
      DONATIONS TO READ
    </h3>
    <div id="filter" class="mx-3">
      <v-text-field
        v-model="filter"
        placeholder="Filter donations by donator name"
      ></v-text-field>
    </div>
    <v-divider />
    <div class="pa-2" style="height: 100%; overflow: auto">
      <v-expansion-panels v-if="donations.length > 0" accordion multiple>
        <donation
          v-for="donation in donations"
          v-show="
            donation.name.toLowerCase().includes(filter) &&
            !readDonations[donation.id]
          "
          :donation="donation"
          :key="donation.id"
        />
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import Donation from "./Donation.vue";

export default {
  name: "DonationPanel",
  data: () => ({
    filter: "",
  }),
  computed: {
    donations() {
      return this.$store.state.donations;
    },
    readDonations() {
      return this.$store.state.readDonations;
    },
  },
  components: {
    Donation,
  },
};
</script>
