import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class LinkForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon_id: this.props.update ? this.props.trail.icon_id : this.props.firsticon,
      memory_ids : [],
    };
  }

  getValue = (stateKey, event) => {
    let value = event.target.value;
    console.log();
    console.log(value);
    this.setState({ [stateKey]: value });
  };

  nextMemory= () => {
    
    const addedMem = [...this.state.memory_ids, 0]
    this.setState({memory_ids : addedMem})
  }

  updateMemoryPath = (e) => {
    console.log(e.target)
    let addedMem = [...this.state.memory_ids]
    addedMem[Number(e.target.id)] = Number(e.target.value)
    this.setState({memory_ids : addedMem})
  }
	
  hasDuplicates = (arr) =>{
      return new Set(arr).size !== arr.length; 
  }

  sendRequest = () => {
    if (this.hasDuplicates(this.state.memory_ids)){
      alert("Il y a des doublons dans le chemin")
      return;
    }
    // if (this.state.trail === '') {
    //   alert(' le mot clef ne peut pas être vide');
    //   return;
    // }
    fetch(ENDPOINT_API + '/createtrailpath/' + this.props.trail.id, {
      method: 'PUT',
      body: JSON.stringify({
        memory_ids : this.state.memory_ids
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
    // if used i more than 1 trail the memory doesn't appear in the list
    const memories = this.props.memories.filter(mem => 
      (this.props.trailByMemory[mem.id] !== undefined 
      && this.props.trailByMemory[mem.id].length < 2)
      || this.props.trailByMemory[mem.id] === undefined
    )

    return (
      <div className='mainContainer'>
        <h2>Lier les couvenirs de  {this.props.trail.parcours}</h2>
        <div className='newTrail mainContainer'>
          {this.state.memory_ids.map((id, index)=> 
            <select
            name='memories'
            id={index}
            key = {index}
            onChange={(e) => this.updateMemoryPath(e)}
            select={id}
            >
              <option value={0}>...</option>
            {memories.map((memory) => 
                <option key={memory.id} value={memory.id}>
                 {memory.name}
                </option>
            )}
            </select>
          )}
         
          <button onClick={!this.state.memory_ids.includes(0) ? this.nextMemory : undefined}>Ajouter un souvenir</button>
          <button type='button' onClick={this.sendRequest}>
            Valider ce parcours
          </button> 
        </div>
      </div>
    );
  }
}

export default LinkForm;
