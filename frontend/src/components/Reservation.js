import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import tombstone from "../assets/tombstone.png";

const Reservation = () => {
  const { _id } = useParams();
  const [guest, setGuest] = useState();
  useEffect(() => {
    fetch(`/api/get-reservation/${_id}`)
      .then((response) => response.json())
      .then((data) => {
        setGuest(data);
      });
  }, [_id]);
    return (
          // TODO: Display the latest reservation information
      <>
      {!guest ? (
        <Wrapper>
          <p>Loading</p>
        </Wrapper>
      ) : (
        <Wrapper>
          <Div>
            <Title>You are confirmed! </Title>
            <P>
              Reservation #: <Span>{guest.data._id}</Span>
            </P>
            <P>
              Flight #: <Span>{guest.data.flight}</Span>
            </P>
            <P>
              Seat #: <Span>{guest.data.seat}</Span>
            </P>
            <P>
              Name:{" "}
              <Span>
                {guest.data.givenName} {guest.data.surname}
              </Span>
            </P>
            <P>
              Email: <Span>{guest.data.email}</Span>
            </P>
          </Div>
          <IMG src={tombstone} alt="Tombstone" />
        </Wrapper>
      )}
    </>
    
        // STRETCH: add FE components to fetch/update/delete reservations
    )
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 70px;
  margin-bottom: 100px;
`;

const Div = styled.div`
  border: 3px solid var(--color-cadmium-red);
  border-radius: 10px;
  padding: 30px;
`;
const Title = styled.p`
  text-align: center;
  margin-bottom: 30px;
  font-size: 25px;
`;
const P = styled.p`
  padding-bottom: 20px;
  font-size: 18px;
  font-weight: 900;
`;
const Span = styled.span`
  font-weight: normal;
`;
const IMG = styled.img`
  width: 200px;
  margin-top: 50px;
`;

export default Reservation;
