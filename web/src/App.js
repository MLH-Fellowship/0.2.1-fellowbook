import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Search from "./Components/Search";
import Card from "./Components/Card";
import "font-awesome/css/font-awesome.min.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <div className="Search">
          <Search />
        </div>
      </header>
      <main className="container">
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fa fa-github"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fas fa-ellipsis-v"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fas fa-ellipsis-v"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fas fa-ellipsis-v"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fas fa-heart"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fas fa-ellipsis-v"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fas fa-ellipsis-v"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
        <Card
          title="Toledo, Spain"
          subtitle="Also know as The Imperial City."
          tag="Spain"
          iconName="fas fa-ellipsis-v"
          bgPhoto="https://picsum.photos/740/420/?random"
        />
      </main>
    </div>
  );
}

export default App;
