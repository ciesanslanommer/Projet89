import { React, Component } from 'react';
import AdminForm from './AdminForm.js';
import './Admin.css';
import ManageLink from './ManageLink.js'
import AddTrail from './AddTrail.js'

import { ENDPOINT_API } from './constants/endpoints';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkLoaded: false,
      adminFormOpen: false,
      manageLinkOpen: false,
      createTrail: false,
      memories: [],
      memoriesLoaded: false,
      icons: [],
      iconLoaded: false,
      trails: [],
      trailsLoaded: false,
    };
  }

  // exemple from https://reactjs.org/docs/faq-ajax.html
  // To be adapted to our app
  componentDidMount() {
    console.log(`Fetching trail from ${ENDPOINT_API}/trail/`);
    fetch(ENDPOINT_API + '/trail')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! trail = ', result);
          this.setState({
            trail: result,
            trailLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading trail',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

    console.log(`Fetching souvenirs from ${ENDPOINT_API}/icon/`);
    fetch(ENDPOINT_API + '/icon')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! icon = ', result);
          this.setState({
            icons: result,
            iconLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading icons',
            error
          );
          // TODO maybe display an error for the user?
        }
      );
    console.log(`Fetching memory from ${ENDPOINT_API}/memories/`);
    fetch(ENDPOINT_API + '/memories')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! memory = ', result);
          this.setState({
            memories: [...result],
            memoriesLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading memory',
            error
          );
          // TODO maybe display an error for the user?
        }
      );
    this.loadTrail();
  }

  loadTrail = () => {
    this.setState({ trailsLoaded: false });
    console.log(`Fetching keyword from ${ENDPOINT_API}/trail/`);
    fetch(ENDPOINT_API + '/trail')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! trail = ', result);
          this.setState({
            trails: result,
            trailsLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading trail',
            error
          );
          // TODO maybe display an error for the user?
        }
      );
  }

  closeWelcome = (e) => {
    this.setState({ welcomeOpen: false });
  };

  unsetCurrentMemory = e => {
    this.setState({ currentMemory: null });
  }

  openComponent = (stateKey, e) => {
    this.setState({ [stateKey]: true })
  }

  closeComponent = (stateKey, e) => {
    this.setState({ [stateKey]: false })
  }

  render() {
    const trailloaded = this.state.trailLoaded;
    // const adminLoaded = this.state.trailLoaded;

    return (
      <div className='adminBody'>
        {
          !this.state.adminFormOpen && !this.state.manageLinkOpen && !this.state.createTrail &&
          <div>
            <button type="button" onClick={(e) => this.openComponent("adminFormOpen", e)}>Créer un souvenir</button>
            <button type="button" onClick={(e) => this.openComponent("manageLinkOpen", e)}>Lier un parcours avec un souvenir</button>
            <button type="button" onClick={(e) => this.openComponent("createTrail", e)}>Créer un parcours</button>
          </div>
        }
        { trailloaded && this.state.adminFormOpen && (<AdminForm trails={this.state.trail} />)}
        { this.state.manageLinkOpen && (<ManageLink trails={this.state.trails} memories={this.state.memories}/>)}
        {this.state.createTrail && (
          <AddTrail
            icon={this.state.icons}
            firsticon={this.state.icons[0].id}
          />)}
      </div>
    );
  }
}

export default Admin;
