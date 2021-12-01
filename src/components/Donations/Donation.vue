<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      {{ donation.name }} <v-spacer />
      {{ amount }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div>
        <p><b>Donator:</b> {{ donation.name }}</p>
        <p>
          <b>Amount:</b>
          {{ amount }}
        </p>
        <p v-if="donation.comment"><b>Comment:</b> {{ donation.comment }}</p>
        <p><b>Timestamp: </b> {{ timestamp }}</p>
      </div>

      <v-btn color="success" @click="setDonationAsRead">Mark as read</v-btn>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Database from "../../database";

export default {
  name: "Donation",
  props: ["donation"],
  computed: {
    amount() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(this.donation.amount);
    },
    timestamp() {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      return new Date(this.donation.completedAt).toLocaleString(
        "en-GB",
        options
      );
    },
  },
  methods: {
    setDonationAsRead() {
      Database.set(this.donation);
    },
  },
};
</script>
