import React from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";
import Screen from "./components/Screen"



function App() {



  return (
    <div className="App">
        <Screen/>
    </div>
  );
}

export default App;
