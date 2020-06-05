import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Search from "./Components/Search";
import Card from "./Components/Card";
import "font-awesome/css/font-awesome.min.css";
import { fetchData } from "./Components";
import octocat from "./img/octocat-white.png";

class App extends React.Component {
  state = {
    data: [],
    search: "",
    accessToken: null,
  };

  handleInput = (e) => {
    console.log(e.target.value);
    this.setState({ search: e.target.value });
  };

  async componentDidMount() {
    let accessToken = this.state.accessToken;
    if (window.location.search.includes("access_token")) {
      accessToken = window.location.search.substr(1).split("=")[1];
    }

    const fetchedData = await fetchData(accessToken);

    if (!fetchedData || !fetchedData.length) accessToken = null;
    this.setState({ data: fetchedData, accessToken });
  }

  render() {
    if (!this.state.accessToken) {
      return (
        <div className="App">
          <header className="App-header">
            <Header />
          </header>
          <div className="login">
            <h1>Login</h1>
            <p>
              You must be a <a href="https://fellowship.mlh.io/">MLH Fellow</a>,
              and a member of the{" "}
              <a href="https://github.com/MLH-Fellowship">
                MLH Fellowship GitHub organisation
              </a>{" "}
              to use the MLH Fellowbook.
            </p>
            <p>Please login with GitHub below</p>
            <a
              href="https://github.com/login/oauth/authorize?client_id=22d8bad72f3469cd766c&scope=user&allow_signup=false"
              className="login-btn"
            >
              <img src={octocat} />
              <span>Login with GitHub</span>
            </a>
          </div>
        </div>
      );
    } else {
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
              <Search
                handleInput={this.handleInput}
                accessToken={this.state.accessToken}
              />
            </div>
          </header>
          <main className="container">{fellowList}</main>
        </div>
      );
    }
  }
}

export default App;
