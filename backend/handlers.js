"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// returns an array of all flight numbers
const getFlights = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected!");
    const db = client.db("Slingair");
    const result = await db.collection("flights").distinct("flight");

    if (result.length > 0) {
      return response.status(200).json({
        status: 200,
        data: result,
      });
    } else {
      return response.status(404).json({
        status: 404,
        data: result,
        message: `Unable to retrieve list of flights.`,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

// returns all the seats on a specified flight
const getFlight = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const flight = request.params.flight;

  try {
    await client.connect();
    console.log("connected!");
    const db = client.db("Slingair");
    const result = await db.collection("flights").findOne({ flight });
    // const result = await db.collection("flights").find({ flight }).toArray();

    result
      ? response.status(200).json({ status: 200, data: result })
      : response
          .status(404)
          .json({ status: 404, data: result, message: "No flight Found" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

// returns all reservations
const getReservations = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected!");
    const db = client.db("Slingair");
    const result = await db.collection("reservations").find().toArray();
    result
      ? response.status(200).json({ status: 200, data: result })
      : response
          .status(404)
          .json({
            status: 404,
            data: result,
            message: "No reservations found",
          });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

// returns a single reservation
const getSingleReservation = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = request.params.reservation;

  try {
    await client.connect();
    console.log("connected!");
    const db = client.db("Slingair");
    const result = await db.collection("reservations").findOne(_id);

    result
      ? response.status(200).json({ status: 200, data: result })
      : response.status(404).json({
          status: 404,
          data: result,
          message: "Your reservation was not found",
        });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

// creates a new reservation
const addReservation = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected!");
    const db = client.db("Slingair");
    const result = await db.collection("reservations").findOne(_id);

    result
      ? response.status(200).json({ status: 200, data: result })
      : response.status(404).json({
          status: 404,
          data: result,
          message: "Your reservation was not found",
        });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

// updates a specified reservation
const updateReservation = (request, response) => {};

// deletes a specified reservation
const deleteReservation = (request, response) => {};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
