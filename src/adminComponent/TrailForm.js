import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';
const classNames = require('classnames');

class TrailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trail : this.props.update ? this.props.trail.parcours : '',
      icon_id: this.props.update ? this.props.trail.icon_id : this.props.firsticon,
      description: this.props.update ? this.props.trail.description : '',
      entry_message: this.props.update ? this.props.trail.entry_message : '',
      exit_message: this.props.update ? this.props.trail.exit_message : '',
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
        description: this.state.description || '',
        entry_message: this.state.entry_message || '',
        exit_message: this.state.exit_message || '',
        icon_id: this.state.icon_id,
        pos_x: Math.random() * 1000,
        pos_y: Math.random() * 1000,
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
        description: this.state.description || '',
        entry_message: this.state.entry_message || '',
        exit_message: this.state.exit_message || '',
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
            Description (sera affichée au survol de l'icone du parcours)
          </label>
          <textarea
            name='description'
            row='3'
            cols='33'
            maxLength='95'
            onChange={(e) => this.getValue('description', e)}
          >
            {this.state.description}
          </textarea>

          <label>
            Message d'entrée du parcours
          </label>
          <textarea
            name='entry_message'
            rows='15'
            cols='70'
            maxLength='95'
            onChange={(e) => this.getValue('entry_message', e)}
          >
            {this.state.entry_message}
          </textarea>

          {
            // <label>
            //   Message de fin du parcours
            // </label>
            // <textarea
            //   name='exit_message'
            //   row='3'
            //   cols='33'
            //   maxLength='95'
            //   onChange={(e) => this.getValue('exit_message', e)}
            // >
            //   {this.state.exit_message}
            // </textarea>
          }

          <label>
            Choisir une icone <abbr> * </abbr>
          </label>

          <div>
            {
              this.props.icon.map((icon) => {
               if (icon.istrailicon) {
                  return <img
                    className={classNames('admin-icon', 'admin-icon-trail', { 'selected': icon.id === this.state.icon_id })}
                    src={require('../assets/' + icon.path).default}
                    alt='icon'
                    title={icon.name}
                    onClick={e => this.setState({ icon_id: icon.id })}
                  />
               }
                return null;
             })
           }
         </div>
         {
          typeof this.state.icon_id === 'number' && `Vous avez choisi l'icone ${this.props.icon.filter(e => e.id === this.state.icon_id).map(e => e.name)}.`
         }

{
          // <select
          //   name='icons'
          //   id='icon_id'
          //   value = {this.state.icon_id}
          //   onChange={(e) => this.getValue('icon_id', e)}
          // >
          //   {this.props.icon.map((icon) => {
          //     if (icon.istrailicon)
          //       return (
          //         <option key={icon.id} value={icon.id}>
          //           {icon.name}
          //         </option>
          //       );
          //     else return null;
          //   })}
          // </select>
}
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
