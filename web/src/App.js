import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Search from "./Components/Search";
import Card from "./Components/Card";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";

import octocat from "./img/octocat-white.png";

const apiUrl =
  "https://a5c6y99l3g.execute-api.eu-central-1.amazonaws.com/devv/fellows/list";
const fetchData = async (accessToken) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: accessToken,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

class App extends React.Component {
  state = {
    data: [],
    accessToken: null,
  };

  async componentDidMount() {
    let accessToken = this.state.accessToken;
    if (window.location.search.includes('access_token')) {
      accessToken = window.location.search.substr(1).split('=')[1];
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
            <p>You must be a <a href='https://fellowship.mlh.io/'>MLH Fellow</a>, and a member of the <a href='https://github.com/MLH-Fellowship'>MLH Fellowship GitHub organisation</a> to use the MLH Fellowbook.</p>
            <p>Please login with GitHub below</p>
            <a href='https://github.com/login/oauth/authorize?client_id=22d8bad72f3469cd766c&scope=user&allow_signup=false' className='login-btn'>
              <img src={octocat} />
              <span>Login with GitHub</span>
            </a>
          </div>
        </div>
      );
    } else {
      const fellowList = this.state.data.map((item) => (
        <Card key={item.username} item={item} />
      ));

      return (
        <div className="App">
          <header className="App-header">
            <Header />
            <div className="Search">
              <Search
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
