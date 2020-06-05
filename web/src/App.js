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
    search: "",
  };

  handleInput = (e) => {
    console.log(e.target.value);
    this.setState({ search: e.target.value });
  };

  async componentDidMount() {
    const fetchedData = await fetchData();

    // console.log(fetchedData);
    this.setState({ data: fetchedData });
  }
  render() {
    const filterPods = this.state.data.filter((podname) => {
      return podname.pod
        .toLowerCase()
        .includes(this.state.search.toLowerCase());
    });
    const fellowList = filterPods.map((item) => (
      <Card key={item.username} item={item} />
    ));
    return (
      <div className="App">
        <header className="App-header">
          <Header />
          <div className="Search">
            <Search handleInput={this.handleInput} />
          </div>
        </header>
        <main className="container">{fellowList}</main>
      </div>
    );
  }
}

export default App;
