import {React, Component} from 'react';
import './App.css';
import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
import AdminForm from './AdminForm.js';
// import History from './History.js'
import Welcome from './Welcome.js';
//import Zoom from './Zoom.js';

import { ENDPOINT_API } from './constants/endpoints';

class App extends Component {
  constructor(props){
    super(props)
    const idFirstMem = Math.floor(Math.random() * data.nodes.length);
    this.state = {
      noeudsLoaded: false,
      souvenirsLoaded: false,
      currentMemory : idFirstMem,
      docOpen : false,
      WelcomeOpen: true,
      noeuds : [],
      souvenirs : []
    };
  }

  // exemple from https://reactjs.org/docs/faq-ajax.html
  // To be adapted to our app
  componentDidMount (){
    
    // TODO display a loader when not loaded yet?
    console.log(`Fetching souvenirs from ${ENDPOINT_API}/noeuds/`);
    fetch(ENDPOINT_API + '/noeuds')
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Success! noeuds = ", result);
          this.setState({
            noeuds : result,
            noeudsLoaded : true
          });
        },
        (error) => {
          console.error("Oops, something wrong happened when loading noeuds", error);
          // TODO maybe display an error for the user?

        }
      )

    console.log(`Fetching souvenirs from ${ENDPOINT_API}/souvenirs/`);
    fetch(ENDPOINT_API + '/souvenirs')
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Success! souvenirs = ", result);
          this.setState({
            souvenirs : result,
            souvenirsLoaded : true
          });
        },
        (error) => {
          console.error("Oops, something wrong happened when loading souvenirs", error);
          // TODO maybe display an error for the user?

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

  callApi(){

    /*~~~~~~~~~~ Get Request ~~~~~~~~~~*/
    // fetch("http://localhost:3001/souvenirs", {
    //   headers: { 
    //     "Content-type": "application/json; charset=UTF-8"
    //   } 
    // })
    //   .then(res => res.json())
    //   .then(res => console.log(res));

  /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
  //   fetch("http://localhost:3001/souvenirs", {
  //     method : 'POST',
  //     body : JSON.stringify({
  //       name:"Success",
  //       path:"fgdgdfs.png",
  //       nature:"texte"
  //     }),
  //     headers: { 
  //       "Content-type": "application/json; charset=UTF-8"
  //     } 
  //   })
  //     .then(res => res.json())
  //     .then(res => console.log(res));

  /*~~~~~~~~~~ Delete Request ~~~~~~~~~*/
    // fetch("http://localhost:3001/souvenirs/"+ 28, {
    //   method : 'DELETE',
    //   headers: { 
    //     "Content-type": "application/json; charset=UTF-8"
    //   } 
    // })
    //   .then(res => res.json())
    //   .then(res => console.log(res));

  }

  closeWelcome = e => {
    this.setState({WelcomeOpen: false});
  }

  render() {
    const memory = data.nodes[this.state.currentMemory]
    const loaded = this.state.noeudsLoaded && this.state.souvenirsLoaded;
    return (
      <div className= "App">
      {this.state.WelcomeOpen && <Welcome onCrossClick = {this.closeWelcome} />}
        {<Nav />}
        <AdminForm/>
        {loaded &&
          <Trails
            nodeClick = {this.changeDoc}
            toFormat = {{noeuds : this.state.noeuds, souvenirs : this.state.souvenirs}}
          /> 
        }
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