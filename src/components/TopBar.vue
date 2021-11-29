<template>
  <v-system-bar app dark height="30" style="color: white">
    <div>
      <b>{{ campaign }}</b>
    </div>

    <v-spacer />
    <span v-if="timeLeft > 0">
      Refreshing data in <b>{{ timeLeft }}</b> seconds...
    </span>
    <span v-else-if="refreshing">Refreshing data...</span>
    <v-spacer />
    <div>
      <b>{{ time }}</b>
    </div>
  </v-system-bar>
</template>

<script>
export default {
  name: "TopBar",
  data: () => ({
    time: "00:00:00",
    refreshTimer: undefined,
    timeLeft: 30,
  }),
  methods: {
    updateCurrentTime() {
      const date = new Date();
      this.time = date.toLocaleTimeString("en-US", { hour12: false });
    },
    startRefreshCountdown() {
      console.log("Starting refresh timer.");
      this.refreshTimer = setInterval(() => {
        if (this.timeLeft == 1) {
          clearInterval(this.refreshTimer);
          this.$emit("refresh");
          this.timeLeft = 0;
        }

        this.timeLeft -= 1;
      }, 1000);
    },
  },
  mounted() {
    this.updateCurrentTime();
    setInterval(this.updateCurrentTime, 1000);
    this.startRefreshCountdown();
  },
  computed: {
    campaign() {
      return this.$store.state.campaign.name;
    },
    refreshing() {
      return this.$store.state.refreshing;
    },
  },
  watch: {
    refreshing: {
      handler: function () {
        if (!this.refreshing) {
          this.timeLeft = 30;
          this.startRefreshCountdown();
        } else {
          console.log("The data is currently refreshing!");
        }
      },
      deep: true,
    },
  },
};
</script>
