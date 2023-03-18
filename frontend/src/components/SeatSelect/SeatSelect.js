import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Plane from "./Plane";
import Form from "./Form";

const SeatSelect = ({ selectedFlight, setReservationId }) => {
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState("");

  // TODO: POST info to server
  const handleSubmit = (e, formData) => {
    e.preventDefault();
    if (!selectedSeat) return;
    fetch("/api/add-reservation", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        givenName: formData.firstName,
        surname: formData.lastName,
        email: formData.email,
        selectedFlight,
        selectedSeat,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // TODO: Save reservationId
        setReservationId(data.data.insertedId);
        localStorage.setItem("reservationId", data.data.insertedId)
        // TODO: Redirect to confirmation page
        navigate(`/confirmation/${data.data.insertedId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Wrapper>
      <h2>Select your seat and Provide your information!</h2>
      <>
        <FormWrapper>
          <Plane
            setSelectedSeat={setSelectedSeat}
            selectedFlight={selectedFlight}
          />
          <Form handleSubmit={handleSubmit} selectedSeat={selectedSeat} />
        </FormWrapper>
      </>
    </Wrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  margin: 50px 0px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export default SeatSelect;
