import {React, Component} from 'react';
import * as d3 from "d3";
import './App.css';
import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
import AdminForm from './AdminForm.js';
// import History from './History.js'
import Welcome from './Welcome.js';

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
      //parcours
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
    //console.log(nodeId);
    const nextMem = nodeId;
    this.setState({ currentMemory : nextMem })
    data.nodes[nextMem].visited = true
    this.openMemory();

    /** Handle parcours highlighting **/
    const currentNode = data.nodes[nodeId];
    /* Initialization: clean parcours highlight */
    this.removeHighlightParcours();
    /* If the current node is in a parcours, highlight all nodes in the parcours */
    if (currentNode.parcours != null) {
      this.highlightParcours(currentNode);
    }

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

  highlightParcours(currentNode) {

    const nodes = data.nodes;

    /*** Initialization: set notInParcours state for all ***/
    nodes.forEach( (node) => d3.select(`[id="${node.id}"] section`).attr("class", "notInParcours") );
    data.links.forEach((link) => d3.select(`[id="${link.source},${link.target}"]`).attr("class", "notInParcours") );
          
    /*** Change to inParcours state only if conditions met ***/
    currentNode.parcours.forEach(element => {
      /** Handle node highlighting **/
      nodes.forEach((node) => {
        let htmlNode = d3.select(`[id="${node.id}"] section`);
        if(node.parcours!=null && node.parcours.indexOf(element)!==-1) { // if node is in the parcours
          htmlNode.classed("notInParcours", false);
          htmlNode.classed("inParcours", true);
        }
      });
      /** Handle link highlighting **/
      data.links.forEach((link) => {
        let htmlLink = d3.select(`[id="${link.source},${link.target}"]`);
        if (nodes[link.source].parcours!=null // if source node is in a parcours
        && nodes[link.target].parcours!=null // if target node is in a parcours
        && nodes[link.source].parcours.indexOf(element)!==-1 // if current node's parcours matches one of source's parcours
        && nodes[link.target].parcours.indexOf(element)!==-1 // if current node's parcours matches one of target's parcours
        ) { 
          htmlLink.classed("notInParcours", false);
          htmlLink.classed("inParcours", true);
        }
      });
    });

  }

  removeHighlightParcours() {

    /* Remove node highlighting */
    data.nodes.forEach( (node) => {
      let htmlNode = d3.select(`[id="${node.id}"] section`);
      htmlNode.classed("notInParcours", null); 
      htmlNode.classed("inParcours", null); 
    });
  
    /* Remove link highlighting */
    data.links.forEach( (link) => {
      let htmlLink = d3.select(`[id="${link.source},${link.target}"]`);
      htmlLink.classed("notInParcours", null); 
      htmlLink.classed("inParcours", null); 
    });
  };

  closeWelcome = e => {
    this.setState({WelcomeOpen: false});
  }


  render() {
    const memory = data.nodes[this.state.currentMemory]
    const loaded = this.state.noeudsLoaded && this.state.souvenirsLoaded;
    return (
      <div className= "App">
        <Nav />
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