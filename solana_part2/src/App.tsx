import React from 'react';
import './App.css';
import ConnectAirdrop from './components/Connect_Airdrop';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Examples</h1>
      </header>
      <ConnectAirdrop/>
    </div>
  );
}

export default App;
