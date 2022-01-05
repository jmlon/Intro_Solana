import React from 'react';
import './App.css';
import Connect2Phantom from './components/Connect2Phantom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Examples</h1>
        <hr className="fullWidth" />

        <p>Hello there</p>
        <Connect2Phantom/>

      </header>
    </div>
  );
}

export default App;
