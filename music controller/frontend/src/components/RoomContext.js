// RoomContext.js
import React, { createContext, useState } from "react";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [votesToSkip_from_createroom, setVotesToSkip_from_createroom] =
    useState(2);
  const [guestCanPause_from_createroom, setGuestCanPause_from_createroom] =
    useState(false);

  const updateRoom = (votesToSkip, guestCanPause) => {
    setVotesToSkip_from_createroom(votesToSkip);
    setGuestCanPause_from_createroom(guestCanPause);
  };

  const updateRoomDetails = (votesToSkip, guestCanPause) => {
    updateRoom(votesToSkip, guestCanPause);
  };

  return (
    <RoomContext.Provider
      value={{
        votesToSkip_from_createroom,
        guestCanPause_from_createroom,
        updateRoomDetails,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
