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
  } finally {
    client.close();
  }
};

// returns all reservations
const getReservations = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("Slingair");
    const result = await db.collection("reservations").find().toArray();
    result
      ? response.status(200).json({ status: 200, data: result })
      : response.status(404).json({
          status: 404,
          data: result,
          message: "No reservations found",
        });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

// returns a single reservation
const getSingleReservation = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const { _id } = request.params.reservation;

  try {
    await client.connect();
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
  } finally {
    client.close();
  }
};

// creates a new reservation
const addReservation = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const { email, selectedSeat, selectedFlight, givenName, surname } =
    request.body;

  try {
    await client.connect();
    const db = client.db("Slingair");

    const result = await client.db("Slingair")
      .collection("flights")
      .findOne({ _id: selectedFlight, "seats.id": selectedSeat });

    if (!result) {
      return response.status(404).json({
        status: 404,
        data: result,
        message: "Your reservation was not found",
      });
    }
    if (!email.includes("@")) {
      return response
        .status(404)
        .json({ status: 404, message: "This email is not possible!" });
    }

    if (!result.seats.find((seats) => seats.id === selectedSeat).isAvailable) {
      return response
        .status(400)
        .json({ status: 400, message: "Selected seat is already reserved" });
    }

    await db.collection("reservations").insertOne({
      _id: uuidv4(),
      flight: selectedFlight,
      seat: selectedSeat,
      givenName,
      surname,
      email,
    });

    await db
      .collection("flights")
      .updateOne(
        { _id: selectedFlight, "seats.id": selectedSeat },
        { $set: { "seats.$.isAvailable": false } }
      );

    return response
      .status(200)
      .json({ status: 200, message: "Your booking has been created" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
};

// updates a specified reservation
const updateReservation = (request, response) => {};

// deletes a specified reservation
const deleteReservation = async (request, response) => {
  const _id = request.params.reservation;
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Slingair");

  try {
    await client.connect();
    const result = await db.collection("reservations").findOne({ _id });
    if (!result) {
      return response
        .status(404)
        .json({ status: 404, message: "Reservation not found" });
    }
    const result2 = await db.collection("reservations").deleteOne({ _id });
    if (result2.deletedCount === 1) {
      await db
        .collection("flights")
        .updateOne(
          { _id: result.flight, "seats.id": result.seat },
          { $set: { "seats.$.isAvailable": true } }
        );
      return response
        .status(200)
        .json({ status: 200, message: "Your Reservation was deleted" });
    } else if (result2.deletedCount === 0) {
      return response.status(400).json({
        status: 400,
        message: "Failed to delete the reservation",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
