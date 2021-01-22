import {React, Component} from 'react';
import './App.css';
import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
// import History from './History.js'
import Welcome from './Welcome.js';
//import Zoom from './Zoom.js';

import { ENDPOINT_API } from './constants/endpoints';

class App extends Component {
  constructor(props){
    super(props)
    const idFirstMem = Math.floor(Math.random() * data.nodes.length);
    this.state = {
      isLoaded: false,
      // history : [idFirstSouvenir],
      currentMemory : idFirstMem,
      docOpen : false,
      WelcomeOpen: true,
    };
  }

  // exemple from https://reactjs.org/docs/faq-ajax.html
  // To be adapted to our app
  componentDidMount (){
    console.log(`Fetching souvenirs from ${ENDPOINT_API}/souvenirs/`);
    fetch(ENDPOINT_API + '/souvenirs')
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Success! Souvenirs = ", result);
          this.setState({
            isLoaded: true, // TODO display a loader when not loaded yet?
            // souvenirs: result, // to be adapted to our data!
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error("Oops, something wrong happened when loading souvenirs", error);
          // TODO maybe display an error for the user?
          this.setState({
            isLoaded: true,
          });
        }
      )
  }

  closeMemory = e => {
    this.setState({docOpen: false});
    document.querySelector('.App').classList.remove('displayDoc');
  }
  openMemory = e => {
    this.setState({docOpen: true});
    

  }

  getLinks(nodeId) {
    let sources = data.links.map((el) => {
      if (el.target === nodeId)
        return {id : el.source, parcours : data.nodes[el.source].parcours}
      return ""
    }).filter( el => el !== "")
    let targets = data.links.map((el) => {
      if (el.source === nodeId)
        return {id : el.target, parcours : data.nodes[el.target].parcours}
      return ""
    }).filter( el => el !== "")
    return {sources, targets}
  }

  changeDoc = (nodeId,visible,e) => {

    /* Graph must be reduced before changing the state of current memory */
    /* Else the current node will be centered on the full window and not the reduced graph */
    document.querySelector('.App').classList.add('displayDoc');

    const nextMem = nodeId;
    this.setState({ currentMemory : nextMem })
    data.nodes[nextMem].visited = true
    this.openMemory();
  }

  closeWelcome = e => {
    this.setState({WelcomeOpen: false});
  }

  render() {
    const memory = data.nodes[this.state.currentMemory]
    return (
      <div className= "App">
      {this.state.WelcomeOpen && <Welcome onCrossClick = {this.closeWelcome} />}
        {<Nav />}
        <Trails
          nodeClick = {this.changeDoc}
          docOpen = {this.state.docOpen}
          currentMemory = {this.state.currentMemory}
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