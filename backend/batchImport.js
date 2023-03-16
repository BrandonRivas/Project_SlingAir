const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" });

const { flights, reservations } = require("./data");

const MONGO_URI = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const flightInfo = Object.keys(flights).map((info) => {
  return {
    _id:info,
    flight: info,
    seats: flights[info]
  }
})


const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    console.log("connected!");
    const db = client.db("Slingair");
    await db.collection("flights").insertMany(flightInfo);
    await db.collection("reservations").insertMany(reservations);
    console.log("Posted data")
  } catch (error) {
    console.log("Server Error: " + error.message);
  } finally {
    client.close();
  }
};

batchImport();
