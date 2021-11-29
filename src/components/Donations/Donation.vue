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
        <p v-if="donation.comment">
          <b>Comment:</b> {{ donation.comment }}
        </p>
      </div>

      <v-btn color="success" @click="setDonationAsRead">Mark as read</v-btn>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Database from '../../database';

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
  },
  methods: {
      setDonationAsRead() {
          Database.set(this.donation);
      }
  }
};
</script>
