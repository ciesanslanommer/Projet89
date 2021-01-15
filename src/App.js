import './App.css';
import data from './souvenirs.json'
import Document from './Document.js'
import Trails from './Trails.js'
import Nav from './Nav.js'
// import History from './History.js'
import {React, Component} from 'react';


class App extends Component {
  constructor(props){
    super(props)
    const idFirstMem = Math.floor(Math.random() * data.nodes.length);
    const firstLink = this.getLinks(idFirstMem);
    this.state = {
      // history : [idFirstSouvenir],
      currentMemory : idFirstMem,
      links : firstLink,
      docOpen : false,
    };
  }
    
  
  getLinks(idMem){ 
    const linksToReturn =  data.links.filter(link => link.source === idMem); 
    return linksToReturn;
  }

  nextMemory = e =>{
    let linkIndex = Math.floor(Math.random()* this.state.links.length);
    
    const nextMem = this.state.links[linkIndex].target;
    const nextLink = this.getLinks(nextMem);

    //change currentMemory and current Link
    this.setState({ 
      currentMemory: nextMem, 
      links: nextLink
    })
    
  }

  closeMemory = e => {
    this.setState({docOpen: false});
  }
  openMemory = e => {
    this.setState({docOpen: true});
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
    const memId = this.state.links[0].source
    return (
      <div className= "App">
        <Trails
          currentNode = {memId}
          nodeClick = {this.setMemory}
        />
        {this.state.docOpen ?
          <Document 
            key = {memId}
            path = {memory.path}
            desc = {memory.name}
            format = {memory.format}
            onClick = {this.closeMemory}
          />
          : null
        }
        {<Nav />}
      </div>
    );
  }
}

export default App;