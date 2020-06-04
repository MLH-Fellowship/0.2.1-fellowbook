import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Search from "./Components/Search";
import Card from "./Components/Card";
import "font-awesome/css/font-awesome.min.css";
import { fetchData } from "./Components";

class App extends React.Component {
  state = {
    data: [],
  };

  async componentDidMount() {
    const fetchedData = await fetchData();

    // console.log(fetchedData);
    this.setState({ data: fetchedData });
  }
  render() {
    const fellowList = this.state.data.map((item) => (
      <Card key={item.username} item={item} />
    ));
    return (
      <div className="App">
        <header className="App-header">
          <Header />
          <div className="Search">
            <Search />
          </div>
        </header>
        <main className="container">{fellowList}</main>
      </div>
    );
  }
}

export default App;
