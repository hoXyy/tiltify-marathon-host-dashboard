# Tiltify Marathon Host Dashboard

## Project setup
This project uses the following environment variables for getting Tiltify data:
- VUE_APP_TILTIFY_CAMPAIGN_ID
- VUE_APP_TILTIFY_ACCESS_TOKEN

The names should be fairly self-explanatory.

In addition, it also uses [Firebase](https://firebase.google.com/) Real Time Database for storing the list of read donations. Setup a project there, and then fill in the configuration localed in `src/firebase.js`.

Afterwards, just running `npm install` and `npm run serve` should give you a build running with a dev server, while `npm run build` should give you a build that you can deploy on any hosting service.
