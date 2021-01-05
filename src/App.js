import './App.css';
import data from './souvenirs.json'
import Document from './Document.js'
import Trails from './Trails.js'
// import History from './History.js'
import {React, Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group'


class App extends Component {
  constructor(props){
    super(props)
    const idFirstMem = Math.floor(Math.random() * data.nodes.length);
    const firstLink = this.getLinks(idFirstMem);
    this.state = {
      // history : [idFirstSouvenir],
      currentMemory : idFirstMem,
      links : firstLink,
    };
  }
    

  getLinks(idMem){ 
    var linksToReturn = [];
    data.links.forEach(link => {
      if (link.source === idMem){
        linksToReturn.push(link);
      }
    })
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

  render() {
    const memory = data.nodes[this.state.currentMemory]
    const memId = this.state.links[0].source
    return (
      <div className="App">
        <header className="App-header" onClick = {this.nextMemory}>
          <CSSTransitionGroup 
            transitionName = "example"
            transitionAppear = {false}
            transitionLeave = {false}
            timeout={1000}>
            <Document 
              key = {memId}
              path = {memory.path}
              desc = {memory.name}
              format = {memory.format}
            />
          </CSSTransitionGroup>
        </header>

        <Trails
          currentNode = {memId}
        
        />

      </div>
    );
  }
}

export default App;