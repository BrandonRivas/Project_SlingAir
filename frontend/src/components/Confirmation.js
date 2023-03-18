import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import tombstone from "../assets/tombstone.png";

const Confirmation = () => {
  const { _id } = useParams();
  const [guest, setGuest] = useState();
  useEffect(() => {
    fetch(`/api/get-reservation/${_id}`)
      .then((response) => response.json())
      .then((data) => {
        setGuest(data);
      });
  }, [_id]);
  console.log(guest);
  return (
    <>
      {!guest ? (
        <p>Loading</p>
      ) : (
        <Wrapper>
          <div>
            <p>You are confirmed! </p>
            <p>
              Reservation #: <span>{guest.data._id}</span>
            </p>
            <p>
              Flight #: <span>{guest.data.flight}</span>
            </p>
            <p>
              Seat #: <span>{guest.data.seat}</span>
            </p>
            <p>
              Name:
              <span>
                {guest.data.givenName} {guest.data.surname}
              </span>
            </p>
            <p>Email: {guest.data.email}</p>
            <IMG src={tombstone} alt="Tombstone" />
          </div> 
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div``;

const IMG = styled.img`
width: 200px;
`

export default Confirmation;
