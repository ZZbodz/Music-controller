// App.js is the main component of the frontend. It is responsible for rendering the different pages of the application.
import { render } from "react-dom";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import UpdateRoomPage from "./UpdateRoomPage";
import { RoomProvider } from "./RoomContext";
import Info from "./Info";

export default function App() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  return (
    <Router>
      <div className="center">
        <RoomProvider>
          <Routes>
            <Route
              path="/"
              element={
                roomCode ? (
                  <Navigate to={`/room/${roomCode}`} replace />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route path="/join" element={<RoomJoinPage />} />
            <Route path="/create" element={<CreateRoomPage />} />
            <Route
              path="/room/:roomCode"
              element={<Room leaveRoomCallback={clearRoomCode} />}
            />
            <Route path="/info" element={<Info />} />
            <Route
              path="/update-room/:roomCode"
              element={<UpdateRoomPage update={true} />}
            />
          </Routes>
        </RoomProvider>
      </div>
    </Router>
  );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
