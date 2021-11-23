<template>
  <div id="host-container">
    <donation-panel class="panel" />
    <div id="side-panel">
      <total-panel class="panel" />
      <read-donation-panel class="panel" />
    </div>

  </div>
</template>

<script>
import DonationPanel from "../components/Donations/DonationPanel.vue";
import TotalPanel from "../components/TotalPanel.vue";
import ReadDonationPanel from '../components/ReadDonations/ReadDonationPanel.vue';

export default {
  name: "Dashboard",
  components: {
    DonationPanel,
    TotalPanel,
    ReadDonationPanel
  },
};
</script>

<style scoped>
#host-container {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
  justify-content: center;
  padding: 5px;
}

.panel {
  margin: 10px;
}

#side-panel {
  height: 90vh;
}
</style>
