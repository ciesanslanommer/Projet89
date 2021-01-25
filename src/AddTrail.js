import { React, Component } from 'react';
import { ENDPOINT_API } from './constants/endpoints';

class AddTrail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trail: '',
      icon_id: '',
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
        const value = '';
        this.setState({
          keyword: value,
        });
        this.props.reloadTrail();
        alert('parcours ajouté');
      });
  };

  render() {
    return (
      <div className='newTrail'>
        <label>Créer un nouveau parcours</label>
        <input
          value={this.state.trail}
          type='text'
          placeholder='Ruines'
          onChange={(e) => this.getValue('trail', e)}
        />
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
        <button type='button' onClick={this.postTrail}>
          Ajouter ce parcours au souvenir
        </button>
      </div>
    );
  }
}

export default AddTrail;
