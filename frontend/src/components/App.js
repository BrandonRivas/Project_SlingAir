import styled from "styled-components";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import SeatSelect from "./SeatSelect";
import Confirmation from "./Confirmation";
import Reservation from "./Reservation";
import GlobalStyles from "./GlobalStyles";

const App = () => {
  const [selectedFlight, setSelectedFlight] = useState("");
  const [reservationId, setReservationId] = useState(() => {
    const storedValue = window.localStorage.getItem("reservationId");
    return storedValue !== null ? JSON.parse(storedValue) : null;
  });

  useEffect(() => {
    window.localStorage.setItem("reservationId", JSON.stringify(reservationId));
  }, [reservationId]);

  const handleChange = (e) => {
    setSelectedFlight(e.target.value);
  };

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header handleChange={handleChange} reservationId={reservationId} />
      <Main>
        <Routes>
          <Route
            path="/"
            element={
              <SeatSelect
                selectedFlight={selectedFlight}
                setReservationId={setReservationId}
              />
            }
          />
          <Route path="/confirmation/:_id" element={<Confirmation />} />
          <Route path="/reservation/:_id" element={<Reservation />} />
          <Route path="" element={<h1>404: Oops!</h1>} />
        </Routes>
        <Footer />
      </Main>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-orange);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
`;

export default App;
