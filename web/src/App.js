import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Search from "./Components/Search";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <div className="Search">
          <Search />
        </div>
      </header>
    </div>
  );
}

export default App;
