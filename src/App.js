import './App.css';
import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
// import History from './History.js'
import {React, Component} from 'react';


class App extends Component {
  constructor(props){
    super(props)
    const idFirstMem = Math.floor(Math.random() * data.nodes.length);
    this.state = {
      // history : [idFirstSouvenir],
      currentMemory : idFirstMem,
      docOpen : false,
    };
  }

  closeMemory = e => {
    this.setState({docOpen: false});
  }
  openMemory = e => {
    this.setState({docOpen: true, visited : true});
  }

  setMemory = (nodeId, e) =>{
    const nextMem = nodeId;
    //change currentMemory and current Link
    this.setState({ 
      currentMemory: nextMem, 
    })
    this.openMemory();
  }


  render() {
    const memory = data.nodes[this.state.currentMemory]
    return (
      <div className= "App">
        {<Nav />}
        <Trails
          nodeClick = {this.setMemory}
        />
        {this.state.docOpen ?
          <Document 
            key = {memory.id}
            path = {memory.path}
            parcours = {memory.parcours}
            desc = {memory.name}
            nature = {memory.nature}
            onClick = {this.closeMemory}
          />
          : null
        }
      </div>
    );
  }
}

export default App;