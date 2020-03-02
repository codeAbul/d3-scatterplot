import React from 'react';
import './App.css';
import ScatterPlot from "./components/ScatterPlot";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Scatterplot using d3</h1>
      </header>
      <main>
        <ScatterPlot/>
      </main>
    </div>
  );
}

export default App;
