import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class LinkForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon_id: this.props.update ? this.props.trail.icon_id : this.props.firsticon,
      memory_ids : [],
      path: [],
      pathLoaded: false
    };
  }

  componentDidMount() {
    //console.log(`Fetching trail from ${ENDPOINT_API}/trail/`+this.props.trail.id);
    fetch(ENDPOINT_API + '/trail/' + this.props.trail.id)
      .then((res) => res.json())
      .then(
        (result) => {
          //console.log('Success! trail = ', result);
          this.setState({
            path: result.message ? [] : result,
            // memory_ids : result,
            pathLoaded: true,
          });
          if (result.length){
            this.setState({
              memory_ids : result,
            })
          }
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

  getValue = (stateKey, event) => {
    let value = event.target.value;
    //console.log();
    //console.log(value);
    this.setState({ [stateKey]: value });
  };

  nextMemory= () => {
    
    const addedMem = [...this.state.memory_ids, 0]
    this.setState({memory_ids : addedMem})
  }

  updateMemoryPath = (e) => {
    //console.log(e.target)
    let addedMem = [...this.state.memory_ids]
    addedMem[Number(e.target.id)] = Number(e.target.value)
    this.setState({memory_ids : addedMem})
  }

  deleteFromMem = (e, indexToDelete) => {
    //console.log(indexToDelete);
      const newArr = this.state.memory_ids.filter((id, index) => index !== indexToDelete);
      this.setState({memory_ids : newArr})
  }
	
  hasDuplicates = (arr) =>{
      return new Set(arr).size !== arr.length; 
  }

  sendRequest = () => {
    if (this.hasDuplicates(this.state.memory_ids)){
      alert("Il y a des doublons dans le chemin")
      return;
    }

    if(this.state.memory_ids.includes(0)){
      alert("Certains souvenir n'ont pas été definis. Un champ ou plusieurs sont vides.")
      return;
    }
    // if (this.state.trail === '') {
    //   alert(' le mot clef ne peut pas être vide');
    //   return;
    // }
    fetch(ENDPOINT_API + '/createtrailpath/' + this.props.trail.id, {
      method: 'PUT',
      body: JSON.stringify({
        previous_ids : this.state.path,
        memory_ids : this.state.memory_ids
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
        //console.log(res);
        alert('Lien bien ajouté :)');
      }).catch(e => console.error(e));
  };


  render() {
    // if used it more than 1 trail the memory doesn't appear in the list
    const memories = this.props.memories
    // const memories = this.props.memories.filter(mem => 
    //   (this.props.trailByMemory[mem.id] !== undefined 
    //   && this.props.trailByMemory[mem.id].length < 2)
    //   || this.props.trailByMemory[mem.id] === undefined
    // )
    return (
    this.state.pathLoaded && 
      <div className='mainContainer'>
        <h2>Lier les souvenirs de  {this.props.trail.parcours}</h2>
        <div className='newTrail mainContainer'>
          {this.state.memory_ids.map((id, index)=> 
            <div>
              <select
              name='memories'
              id={index}
              key = {index}
              onChange={(e) => this.updateMemoryPath(e)}
              select={id}
              >
                <option value={0}>...</option>
              {memories.map((memory) => 
                  <option key={memory.id} value={memory.id} selected={memory.id === id}>
                  {memory.name}
                  </option>
              )}
              </select>
              <button onClick={(e) => this.deleteFromMem(e, index)}>x</button>
            </div>
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
