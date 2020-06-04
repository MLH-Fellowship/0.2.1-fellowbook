import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Search from "./Components/Search";
import Card from "./Components/Card";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";

const apiUrl =
  "https://a5c6y99l3g.execute-api.eu-central-1.amazonaws.com/devv/fellows/list";
const token = "19301c6083bac73cde74bf4d39fbcd6f79934713";
const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

class App extends React.Component {
  state = {
    data: [],
  };

  async componentDidMount() {
    const fetchedData = await fetchData();

    this.setState({ data: fetchedData });
  }
  render() {
    const fellowList = this.state.data.map((item) => (
      <Card key={item.username} item={item} />
    ));
    console.log(fellowList);
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
