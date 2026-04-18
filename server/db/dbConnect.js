const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function dbConnect() {
  const dbUrl = process.env.DB_URL?.trim();
  if (!dbUrl) {
    console.log(
      "DB_URL is missing. Create server/.env and set DB_URL=<your_mongodb_connection_string>",
    );
    return;
  }

  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;
