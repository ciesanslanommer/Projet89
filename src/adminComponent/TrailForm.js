import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class TrailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trail : this.props.update ? this.props.trail.parcours : '',
      icon_id: this.props.update ? this.props.trail.icon_id : this.props.firsticon,
    };
  }

  getValue = (stateKey, event) => {
    let value = event.target.value;
    console.log();
    console.log(value);
    this.setState({ [stateKey]: value });
  };

  postTrail = () => {
    if (this.state.trail === '') {
      alert(' le mot clef ne peut pas être vide');
      return;
    }
    fetch(ENDPOINT_API + '/trail', {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.trail,
        icon_id: this.state.icon_id,
        pos_x: Math.random() * 1000,
        pos_y: Math.random() * 1000,
        description: 'yep',
        entry_message: 'yiii',
        exit_message: 'yoooo',
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'x-access-token' : this.props.token,
      },
    })
      .then(function(res) {
          if (!res.ok) {
            res.json().then(s => alert('Erreur : ' + s.message));
            throw res;
          }
          return res.json();
      })
      .then((res) => {
        console.log(res);
        alert('Parcours bien ajouté :)');
      }).catch(e => console.error(e));
  };

  updateTrail = () => {
    if (this.state.trail === '') {
      alert(' le mot clef ne peut pas être vide');
      return;
    }
    fetch(ENDPOINT_API + '/trail/' + this.props.trail.id, {
      method: 'PUT',
      body: JSON.stringify({
        name: this.state.trail,
        icon_id: this.state.icon_id
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'x-access-token' : this.props.token,
      },
    })
      .then(function(res) {
        if (!res.ok) {
          res.json().then(s => alert('Erreur : ' + s.message));
          throw res;
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        alert('Le parcours a bien été mis à jour :)');
      }).catch(e => console.error(e));
  };

  render() {
    return (
      <div className='mainContainer'>
        <h2>Créer un nouveau parcours</h2>
        <div className='newTrail mainContainer'>
          <label>Nom du parcours</label>
          <input
            value={this.state.trail}
            type='text'
            placeholder='Ruines'
            onChange={(e) => this.getValue('trail', e)}
          />
          <label>
            Choisir une icone <abbr> * </abbr>
          </label>
          <select
            name='icons'
            id='icon_id'
            value = {this.state.icon_id}
            onChange={(e) => this.getValue('icon_id', e)}
          >
            {this.props.icon.map((icon) => {
              if (icon.istrailicon)
                return (
                  <option key={icon.id} value={icon.id}>
                    {icon.name}
                  </option>
                );
              else return null;
            })}
          </select>
          {/* <label>Quel sera son premier souvenir ?</label>
          <select
            name='memories'
            id='memories_id'
            onChange={(e) => this.getValue('memory_id', e)}
            select={this.state.memory_id}
          >
            {memories.map((memory) => {
              return (
                <option key={memory.id} value={memory.id}>
                  {memory.name}
                </option>
              );
            })}
          </select> */}
          {this.props.update ? 
          <button type='button' onClick={this.updateTrail}>
            Mettre à jour le Parcours
          </button> :
          <button type='button' onClick={this.postTrail}>
            Créer Parcours
          </button> 
          }
        </div>
      </div>
    );
  }
}

export default TrailForm;
