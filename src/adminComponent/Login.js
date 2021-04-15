import React, { Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
      error: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      loading: true,
      error: '',
    })

    const { username, password } = this.state;

    fetch(ENDPOINT_API + '/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ loading: false });
        if (res.token) {
          console.log("authentication success!")
          this.props.setToken(res.token);
        } else if (res.message || res.error) {
          const error = res.message || res.error;
          console.error("authentication failure:", error);
          this.setState({ error });
        } else {
          console.error("authentication failure: unknown error");
          this.setState({ error: "Echec d'authentification" });
        }
      })
      .catch((error) => {
        console.error('catching authentication failure:', error);
        this.setState({ loading: false, error: error.message });
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className='adminBody'>
        <h1>Mode admin</h1>
        <div className='form'>
          <label>
            Identifiant :
            <br />
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={ e => this.handleChange("username", e.target.value)}
            />
          </label>
          <label>
            Mot de passe :
            <br />
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={ e => this.handleChange("password", e.target.value)}
            />
          </label>
          <input
            type="submit"
            value={this.state.loading ? "Envoi..." : "Envoyer"}
            disabled={this.state.loading ? "disabled" : ""}
          />
          {this.state.error}
        </div>
        </div>
      </form>
    )
  }
}

export default Login;
