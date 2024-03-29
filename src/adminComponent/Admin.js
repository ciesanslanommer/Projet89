import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import MemoryForm from './MemoryForm.js';
import '../Admin.css';
import './AdminForm.css';
import ManageLink from './ManageLink.js';
import TrailForm from './TrailForm.js';
import ManageLinkMemory from './ManageLinkMemory.js';
import LinkForm from './LinkForm.js';
import Login from './Login.js';

import { ENDPOINT_API } from '../constants/endpoints';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkLoaded: false,
      memoryFormOpen: false,
      manageLinkTrailOpen: false,
      manageLinkMemoryOpen: false,
      linkFormOpen : false,
      idTrailToLink : null,
      updateMemory: false,
      updateTrail : false,
      idMemoryToUpdate: null,
      idTrailToUpdate : null,
      createTrail: false,
      memories: [],
      memoriesLoaded: false,
      icons: [],
      iconLoaded: false,
      trails: [],
      trailsLoaded: false,
      trailByMemory : [],
      trailByMemoryLoaded : false,
      token: '',
    };
  }

  // exemple from https://reactjs.org/docs/faq-ajax.html
  // To be adapted to our app
  componentDidMount() {
    //console.log(`Fetching trail from ${ENDPOINT_API}/trail/`);
    fetch(ENDPOINT_API + '/trail')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading trails: ", res.statusText);
          alert("Error loading trails");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          //console.log('Success! trail = ', result);
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

    //console.log(`Fetching icons from ${ENDPOINT_API}/icon/`);
    fetch(ENDPOINT_API + '/icon')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading icons: ", res.statusText);
          alert("Error loading icons");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          //console.log('Success! icon = ', result);
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
    //console.log(`Fetching memory from ${ENDPOINT_API}/memories/`);
    fetch(ENDPOINT_API + '/memories')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading memories: ", res.statusText);
          alert("Error loading memories");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          console.log('Success! Admin memory = ', result, result.ok);
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

    //console.log(`Fetching memory from ${ENDPOINT_API}/trailbymemory/`);
    fetch(ENDPOINT_API + '/trailbymemory')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading trails by memory: ", res.statusText);
          alert("Error loading trails by memory");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          //console.log('Success! trailbymem = ', result);
          this.setState({
            trailByMemory: result,
            trailByMemoryLoaded: true,
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
    //console.log(`Fetching keyword from ${ENDPOINT_API}/trail/`);
    fetch(ENDPOINT_API + '/trail')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading trail: ", res.statusText);
          alert("Error loading trail");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          //console.log('Success! trail = ', result);
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
  };

  closeWelcome = (e) => {
    this.setState({ welcomeOpen: false });
  };

  unsetCurrentMemory = (e) => {
    this.setState({ currentMemory: null });
  };

  openComponent = (stateKey, e) => {
    this.setState({ [stateKey]: true });
    if (stateKey === 'updateMemory') {
      this.setState({ idMemoryToUpdate: e.target.value });
    } else if (stateKey === 'updateTrail'){
      this.setState({ idTrailToUpdate: e.target.value });
    } else if (stateKey === 'linkFormOpen'){
      this.setState({ idTrailToLink: e.target.value });
    }
  };

  closeComponent = (stateKey, e) => {
    this.setState({ [stateKey]: false });
  };

  backAdmin = () => {
    this.setState({
      memoryFormOpen: false,
      manageLinkTrailOpen: false,
      manageLinkMemoryOpen: false,
      createTrail: false,
      updateMemory: false,
      updateTrail: false,
      linkFormOpen : false,
      idMemoryToUpdate: null,
      idTrailToUpdate: null,
      idTrailToLink : null
    });

    this.componentDidMount();
  };

  setToken = (token) => {
    this.setState({ token });
  }

  deleteMemory = (e) => {
    const idToDelete = e.target.value;
    const memoryName = this.state.memories.filter((memory) => memory.id === Number(idToDelete))[0].name;
    const trails = this.state.trailByMemory[idToDelete];
    if (trails) {
      alert("Le souvenir ne peut pas être supprimé car il se trouve dans un parcours. Si vous souhaitez le supprimer, essayez d'abord de le retirer de ses parcours.")
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    const confirmed  = confirm("Le souvenir " + memoryName + " va être supprimé. Il n'y a pas de retour en arrière. Êtes vous sûr de vouloir supprimer le souvenir ? ")
    if (confirmed){
      //console.log(idToDelete);
      //console.log(memoryName);
      //console.log(trails);
      //console.log(`delete souvenirs from ${ENDPOINT_API}/memory/${idToDelete}`);
      fetch(ENDPOINT_API + '/memory/' + idToDelete, {
        method : "DELETE",
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-access-token' : this.state.token,
        },
      })
        .then(function(res) {
          if (!res.ok) {
            res.json().then(s => alert('Erreur : ' + s.message));
            throw res;
          }
          return res.json();
        })
        .then(
          (result) => {
            alert('Souvenir bien supprimé :)');
            this.componentDidMount();
          },
        ).catch(e => console.error(e));
      }
  }

  deleteTrail = (e) => {
    const idToDelete = e.target.value;
    const name = this.state.trails.filter((trail) => trail.id === Number(idToDelete))[0].name;

    // eslint-disable-next-line no-restricted-globals
    const confirmed  = confirm("Le parcours " + name + " va être supprimé. Il n'y a pas de retour en arrière. Êtes vous sûr de vouloir supprimer le parcours ? ")
    if (confirmed){
      fetch(ENDPOINT_API + '/trail/' + idToDelete, {
        method : "DELETE",
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'x-access-token' : this.state.token,
        },
      })
        .then(function(res) {
          if (!res.ok) {
            res.json().then(s => alert('Erreur : ' + s.message));
            throw res;
          }
          return res.json();
        })
        .then(
          (result) => {
            alert('Parcours bien supprimé :)');
            this.componentDidMount();
          },
        ).catch(e => console.error(e));
      }
  }

  render() {
    const trailloaded = this.state.trailLoaded;
    const memoriesLoaded = this.state.memoriesLoaded;
    // const adminLoaded = this.state.trailLoaded;

    if (!this.state.token) {
      return <Login setToken={token => this.setToken(token)} />
    }

    return (
      <div className='adminBody'>
        <h1>Mode admin</h1>

        <button
          type='button'
          onClick={(e) => this.props.history.push("/preview")}
        >
          ⬅️ Retour au mode preview
        </button>

        <br/>

        {!this.state.memoryFormOpen &&
        !this.state.manageLinkTrailOpen &&
        !this.state.manageLinkMemoryOpen &&
        !this.state.updateMemory &&
        !this.state.updateTrail &&
        !this.state.linkFormOpen &&
        !this.state.createTrail ? (
          <div className='form'>

            <div className="adminRow">
              <h2>Créations</h2>
              <div className="formRow">
                <button
                  type='button'
                  onClick={(e) => this.openComponent('memoryFormOpen', e)}
                >
                  Créer un souvenir
                </button>
                <button
                  type='button'
                  onClick={(e) => this.openComponent('createTrail', e)}
                >
                  Créer un parcours
                </button>
              </div>
            </div>

            <div className="adminRow">
              <h2>Modifications</h2>
              <div className="formRow">
                <select onChange={(e) => this.openComponent('updateMemory', e)}>
                  <option value='null'>Modifier un souvenir</option>
                  {this.state.memories
                    .sort((a,b) => a.name.localeCompare(b.name))
                    .map((memory) => {
                    return (
                      <option key={memory.id} value={memory.id}>
                        {`${memory.name} (id:${memory.id})`}
                      </option>
                    );
                  })}
                </select>
                <select onChange={(e) => this.openComponent('updateTrail', e)}>
                  <option value='null'>Modifier un parcours</option>
                  {this.state.trails
                    .sort((a,b) => a.parcours.localeCompare(b.parcours))
                    .map((trail) => {
                    return (
                      <option key={trail.id} value={trail.id}>
                        {`${trail.parcours} (id:${trail.id})`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="adminRow">
              <h2>Lier les souvenirs en parcours</h2>
              <div className="formRow">
                <select onChange={(e) => this.openComponent('linkFormOpen', e)}>
                    <option value='null'>Creer les liens de ...</option>
                    {this.state.trails
                      .sort((a,b) => a.parcours.localeCompare(b.parcours))
                      .map((trail) => {
                      return (
                        <option key={trail.id} value={trail.id}>
                          {`${trail.parcours} (id:${trail.id})`}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <div className="adminRow">
              <h2>Suppression d'un souvenir</h2>
              <div className="formRow">
                <select onChange={(e) => this.deleteMemory(e)}>
                    <option value='null'>Supprimer un souvenir </option>
                    {this.state.memories
                      .sort((a,b) => a.name.localeCompare(b.name))
                      .map((memory) => {
                      return (
                        <option key={memory.id} value={memory.id}>
                          {`${memory.name} (id:${memory.id})`}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <div className="adminRow">
              <h2>Suppression d'un parcours</h2>
              <div className="formRow">
                <select onChange={(e) => this.deleteTrail(e)}>
                    <option value='null'>Supprimer un parcours </option>
                    {this.state.trails
                      .sort((a,b) => a.parcours.localeCompare(b.parcours))
                      .map((trail) => {
                      return (
                        <option key={trail.id} value={trail.id}>
                          {`${trail.parcours} (id:${trail.id})`}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            {/* <div>
              <button
                type='button'
                onClick={(e) => this.openComponent('manageLinkTrailOpen', e)}
              >
                Lier un parcours avec un souvenir
              </button>
              <button
                type='button'
                onClick={(e) => this.openComponent('manageLinkMemoryOpen', e)}
              >
                Lier un souvenir à un parcours
              </button> 
            </div>*/}  
          </div>
        ) : (
          <button
            type='button'
            className='returnButton'
            onClick={this.backAdmin}
          >
            Retour
          </button>
        )}
        {trailloaded && this.state.memoryFormOpen && (
          <MemoryForm trails={this.state.trail} token={this.state.token} />
        )}
        {this.state.manageLinkTrailOpen && (
          <ManageLink
            trails={this.state.trails}
            memories={this.state.memories}
            token = {this.state.token}
          />
        )}
        {this.state.manageLinkMemoryOpen && (
          <ManageLinkMemory
            trails={this.state.trails}
            memories={this.state.memories}
            token={this.state.token}
          />
        )}
        {this.state.createTrail && (
          <TrailForm
            icon={this.state.icons}
            firsticon={this.state.icons.length ? this.state.icons[0].id : ''}
            update = {false}
            trail = {undefined}
            token = {this.state.token}
          />
        )}

        {trailloaded && memoriesLoaded && this.state.updateMemory && (
          <MemoryForm
            trails={this.state.trail}
            memory={this.state.memories.find(
              (mem) => mem.id === Number(this.state.idMemoryToUpdate)
            )}
            token = {this.state.token}
          />
        )}

        {trailloaded && memoriesLoaded && this.state.updateTrail && (
          <TrailForm
            icon = {this.state.icons}
            update = {true}
            trail={this.state.trail.find(
              (trail) => trail.id === Number(this.state.idTrailToUpdate)
            )}
            token = {this.state.token}
          />
        )}

        {trailloaded && memoriesLoaded && this.state.linkFormOpen && (
          <LinkForm
            trail={this.state.trail.find(
              (trail) => trail.id === Number(this.state.idTrailToLink)
            )}
            memories = {this.state.memories}
            trailByMemory = {this.state.trailByMemory}
            token = {this.state.token}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Admin);
