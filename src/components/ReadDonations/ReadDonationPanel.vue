<template>
  <div
    id="donations"
    style="height: 88%; width: 400px; display: flex; flex-direction: column"
    class="rounded-lg elevation-6"
  >
    <h3
      style="width: 100%; text-align: center; position: sticky; color: white"
      class="black pa-1 rounded-tl-lg rounded-tr-lg"
    >
      ALREADY READ DONATIONS
    </h3>
    <div id="filter" class="mx-3">
      <v-text-field
        v-model="filter"
        placeholder="Filter donations by donator name"
      ></v-text-field>
    </div>
    <v-divider />
    <div class="pa-2" style="height: 100%; overflow: auto">
      <div v-if="donations.length > 0">
        <v-expansion-panels accordion multiple>
          <read-donation
            v-for="donation in donations"
            v-show="
              donation.name.toLowerCase().includes(filter) &&
              readDonations[donation.id]
            "
            :donation="donation"
            :key="donation.id"
          />
        </v-expansion-panels>
      </div>
    </div>
  </div>
</template>

<script>
import ReadDonation from "./ReadDonation.vue";

export default {
  name: "ReadDonationPanel",
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
    ReadDonation,
  },
};
</script>
