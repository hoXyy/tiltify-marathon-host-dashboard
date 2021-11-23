import database from "./firebase";
import { ref, set } from "firebase/database";

class Database {
  set(donation) {
    console.log("Adding to database");
    return set(
      ref(
        database,
        `${process.env.VUE_APP_TILTIFY_CAMPAIGN_ID}/${donation.id}`
      ),
      donation
    );
  }

  delete(id) {
    return set(
      ref(database, `${process.env.VUE_APP_TILTIFY_CAMPAIGN_ID}/${id}`),
      null
    );
  }
}

export default new Database();
