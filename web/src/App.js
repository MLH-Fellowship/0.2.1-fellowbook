import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Search from "./Components/Search";
import Card from "./Components/Card";
import "font-awesome/css/font-awesome.min.css";
import { fetchData } from "./Components";
import octocat from "./img/octocat-white.png";

const lower = (data) => (data ? data.toLowerCase() : "");
class App extends React.Component {
  state = {
    data: [],
    search: "",
    accessToken: null,
  };

  handleInput = (e) => {
    this.setState({ search: e.target.value.toLowerCase() });
  };

  async componentDidMount() {
    // Get saved access token from session storage
    let accessToken = window.sessionStorage.getItem("accessToken");

    if (window.location.search.includes("access_token")) {
      accessToken = window.location.search.substr(1).split("=")[1];
      window.sessionStorage.setItem("accessToken", accessToken);
      window.location = "/";
    }

    const fetchedData = await fetchData(accessToken);
    console.log(fetchedData);
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
              <img src={octocat} alt="octacat" />
              <span>Login with GitHub</span>
            </a>
          </div>
        </div>
      );
    } else {
      // Filter fellows by pod, bio, location, name, username by checking if
      // the search string is contained in any of those fields
      const filteredFellows = this.state.data.filter((fellow) =>
        [
          lower(fellow.pod),
          lower(fellow.bio),
          lower(fellow.location),
          lower(fellow.name),
          lower(fellow.username),
        ].some((data) => data !== "" && data.includes(this.state.search))
      );
      const fellowList = filteredFellows.map((item) => (
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
          <div className="fellows-count">
            {filteredFellows.length} fellow
            {filteredFellows.length === 1 ? "" : "s"}
          </div>
          <main className="container">{fellowList}</main>
        </div>
      );
    }
  }
}

export default App;
