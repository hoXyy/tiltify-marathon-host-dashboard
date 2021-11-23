const TiltifyClient = require("tiltify-api-client");
const tiltifyapi = new TiltifyClient(process.env.VUE_APP_TILTIFY_ACCESS_TOKEN);

export default tiltifyapi;
