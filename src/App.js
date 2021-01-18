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
    this.setState({docOpen: true});
  }

  getLinks(nodeId) {
    let sources = data.links.map((el) => {
      if (el.target === nodeId)
        return el.source
      return ""
    }).filter( el => el !== "")
    let targets = data.links.map((el) => {
      if (el.source === nodeId)
        return el.target
      return ""
    }).filter( el => el !== "")
    return {sources, targets}
  }

  changeDoc = (nodeId,e) => {
    //console.log(nodeId);
    const nextMem = nodeId;
    this.setState({ currentMemory : nextMem })
    data.nodes[nextMem].visited = true
    this.openMemory();
  }


  render() {
    const memory = data.nodes[this.state.currentMemory]
    return (
      <div className= "App">
        {<Nav />}
        <Trails
          nodeClick = {this.changeDoc}
        />
        {this.state.docOpen ?
          <Document 
            key = {memory.id}
            path = {memory.path}
            parcours = {memory.parcours}
            links = {this.getLinks(memory.id)}
            desc = {memory.name}
            nature = {memory.nature}
            subs = {memory.subs}
            onCrossClick = {this.closeMemory}
            onNextClick = {this.changeDoc}
          />
          : null
        }
      </div>
    );
  }
}

export default App;