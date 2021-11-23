<template>
  <div id="total" class="rounded-lg elevation-6 text-center" style="width: 400px; height: 11%; padding: 10px;">
    <h3>AMOUNT RAISED SO FAR</h3>
    <h1>{{ total }}</h1>
  </div>
</template>

<script>
export default {
  name: "TotalPanel",
  computed: {
    total() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(this.$store.state.campaign.total);
    },
  },
};
</script>
