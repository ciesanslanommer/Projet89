import { least } from 'd3';
import { React, Component } from 'react';
import { ENDPOINT_API } from './constants/endpoints';

class AddTrail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trail: '',
      icon_id: '',
      memory_id: '',
      memories: [],
      memoriesLoaded: false,
    };
  }

  getValue = (stateKey, event) => {
    let value = event.target.value;
    console.log();
    console.log(value);
    this.setState({ [stateKey]: value });
  };

  componentDidMount() {
    // TODO display a loader when not loaded yet?
    console.log(`Fetching memories from ${ENDPOINT_API}/memories/`);
    fetch(ENDPOINT_API + '/memories')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! memories = ', result);
          this.setState({
            memories: result,
            memoriesLoaded: true,
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
    }

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
        target_id: this.state.memory_id,
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
    let memories = this.state.memories
    return (
      <div className='newTrail'>
        <label>Créer un nouveau parcours</label>
        <input
          value={this.state.trail}
          type='text'
          placeholder='Ruines'
          onChange={(e) => this.getValue('trail', e)}
        />
        <label>Choisir une icone <abbr> * </abbr></label>
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
        <label>Quel sera son premier souvenir ?</label>
        <select
              name='memories'
              id='memories_id'
              onChange={(e) => this.getValue('memory_id', e)}
            >
              {memories.map((memory) => {
                return (
                  <option key={memory.id} value={memory.id}>
                    {memory.name}
                  </option>
                );
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
