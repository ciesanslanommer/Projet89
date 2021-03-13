import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class AddTrail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon_id: this.props.firsticon,
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
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        alert('parcours ajouté');
      });
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

          <button type='button' onClick={this.postTrail}>
            Créer Parcours
          </button>
        </div>
      </div>
    );
  }
}

export default AddTrail;
