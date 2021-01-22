import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json';
import Background from './assets/fond.png';
import "./Trails.css";
import CustomNode from './CustomNode.js';
import Zoom from './Zoom.js';


const myConfig = {
    nodeHighlightBehavior: true,
    width:400,
    initialZoom: 1,
    staticGraphWithDragAndDrop : false,
    //staticGraph : true,
    highlightDegree : 0,
    // minZoom: 0,
    // maxZoom: 2,
    focusZoom : 1,
    focusAnimationDuration : 0.75,
    // directed : true,
    freezeAllDragEvents: false,
    node: {
      color: "lightgreen",
      size: 1600,
      highlightStrokeColor: "blue",
      renderLabel : false,
    },
    link: {
      color : "rgba(255, 255, 255, 1)",
      type : "CURVE_SMOOTH",
    },
    d3: {
      disableLinkForce: false,
      gravity: -1000,
    }
  }; 

   
class Trails extends Component {
    constructor(props){
      super(props)
      //this.zoomCursorValue = this.getZoomValue.bind(this);
      data.nodes.forEach( node => { 
        //randomize nodes without position
        if(!node.x){
          node.x = Math.floor(Math.random()* 1000)
          node.y = Math.floor(Math.random()* 1000)
        }
        node.visited = false
        node.visible = true
        if (!node.zoom)
          node.zoom = 0.1
        })
      this.state = {
        nodes: this.formatNodes(this.props.toFormat.noeuds , this.props.toFormat.souvenirs),
        links: this.formatLinks(this.props.toFormat.noeuds),
        focusedNodeId: null,
        width: 0, height : 0,
        zoom : 0.2,
        currentParcours : null,
        freeze: false,
      };
    };


    // data formatting 
    formatNodes(noeuds, souvenirs){
      let nodes = [];
      noeuds.forEach( noeud => {
        let foundSouvenir = souvenirs.find( souv => souv.id === noeud.souvenir_id)
        //const foundParcours = parcours.find( el => el.id === foundSouvenir.parcours_id)
        let obj = {};
        if (foundSouvenir){
          obj.id = noeud.id
          obj.name = foundSouvenir.title
          obj.parcours = []
          obj.path = "2019_27 août_Le conte de Raiponce.mp3"
          obj.nature = "audio"
          obj.x = noeud.x
          obj.y = noeud.y
          obj.visited = false
          obj.visible = true
          obj.zoom = 0.1
          nodes.push(obj)
          //format data 
        }
        foundSouvenir= {}
      })
      console.log(nodes);
      return nodes;
    }

    formatLinks(noeuds){
      let links = [];
      noeuds.forEach( noeud => {
        if (noeud.target_id)
          links.push({source : noeud.id, target : noeud.target_id})
      })
      console.log(links);
      return links;
    }
    // ************************************************************* RESIZING
    componentWillMount () {
      window.addEventListener('resize', this.measure, false);
    }
    componentWillUnmount () {
      window.removeEventListener('resize', this.measure, false);
    }
    componentDidMount () {
      this.measure();
    }
    measure = e => {
      let rect = {width : document.getElementsByClassName("Graph")[0].clientWidth, height: document.getElementsByClassName("Graph")[0].clientHeight};

      if(this.state.width !== rect.width || this.state.height !== rect.height){
        this.setState({
          width: rect.width, 
          height: rect.height
        });
      }
      console.log('MEASURE');
      console.log('html graph: ' + rect.width);
      console.log('state width: ' + this.state.width);
    }
    // ************************************************************* 

    // ************************************************************* EVENT
    nodeClick = (nodeId, e) => {
      //copy array of obj 
      let visitedNode = []
      this.state.nodes.forEach((node) => visitedNode.push({...node}))

      //find current node
      let id = visitedNode.findIndex(node => node.id === Number(nodeId))
      let currentNodeVisited = visitedNode[id];

      // set it to visited
      if(nodeId === this.props.currentMemory) {
        console.log("TEST")
        this.focusOnNode(this.props.currentMemory);
      }
      currentNodeVisited.visited = true
      
      //change obj in copy
      visitedNode[id] = currentNodeVisited

      //set state
      this.setState({nodes:visitedNode})
      this.props.nodeClick(nodeId)


    }

    zoomChange = (prevZoom, newZoom, e) => {
      // console.log(newZoom);
      this.setState({zoom : newZoom});
    }

    zoomCursorValue = (zoomValue) => {
      this.setState({zoom : zoomValue}); 
    }

    savePosition = (nodeId, x,y, e) => {
      var copy = [...this.state.nodes]
      var item = {...copy[nodeId]};
      item.x = x;
      item.y = y;
      copy[nodeId] = item;
      this.setState({nodes : copy});
    }

    customNodeGenerator = (node) => {
      // if(node.highlighted) {
      //   return <Node cx = {node.x} cy = {node.y} fill='green' size = '2000' type = 'square' className = 'node'/>
      // }
      return <CustomNode 
              name = {node.name}
              nature = {node.nature}
              highlighted = {node.highlighted}
              visited = {node.visited}
              zoom = {this.state.zoom}
              nodeZoom = {node.zoom}
            />
    }

    componentDidUpdate(prevProps, prevState) {
      /*** If currentMemory changes  ***/
      if (prevProps.currentMemory !== this.props.currentMemory) {
        const currentParcours = this.state.nodes[this.props.currentMemory].parcours;

        /** Handle parcours highlighting **/
        /* Initialization: clean parcours highlight and set currentParcours to currentMemory's parcours */
        this.setState({currentParcours: currentParcours});
        this.removeAllHighlightParcours();
        /* If the current node is in a parcours, highlight all nodes in the parcours */
        if (currentParcours != null) {
          this.highlightParcours(currentParcours);
        }

        /** Highlights currentNode **/
        this.removeAllHighlightCurrentNode();
        if(this.props.currentMemory != null) { 
          this.highlightCurrentNode(this.props.currentMemory);
        }

        /* Handle focus on current node */
        this.focusOnNode(this.props.currentMemory);

      }

      /*** After opening a doc, if resize window then close doc ***/
      /*** Graph does not resize ***/
      /*** So added below to solve the problem ***/
      if(prevProps.docOpen !== this.props.docOpen) {
        this.measure();
      }

    }

    focusOnNode(nodeId) { 
      
      /* The svg container size isn't updated yet ? So use measure method */
      /* Position of node is centered from the get go but animation is cut */
      console.log("MEASURE 1");
      this.measure();
      console.log("FOCUS");
      console.log('myconfig : ' + myConfig.width);
      console.log('state : ' + this.state.width);
      console.log('html : ' + document.querySelector('#id-graph-wrapper svg').style.width);

      /* Must disable user zoom before setting focus*/
      this.setState({ freeze: true });
      /** Change Node focus **/
      this.setState({ focusedNodeId: nodeId });
      /* Wait the duration of the focusAnimation before setting focus to null */
      /* Else when user zoom, it will create problem */
      setTimeout(() => {
        if (this.state.focusedNodeId !== null) {
          this.setState({ zoom: myConfig.focusZoom });
          this.setState({ focusedNodeId: null });
          this.setState({ freeze: false });
        }
      }, myConfig.focusAnimationDuration + 1000);
    }

    onMouseOverNode = (nodeId, node) => {
      /** If document isn't open **/
      /* currentParcours stays highlighted and parcours mouse overed becomes highlighted */
      /** If document is open, mouse over shouldn't highlight parcours **/
      if (!this.props.docOpen) {
        const parcoursMouseOvered = this.state.nodes[nodeId].parcours;
        if (parcoursMouseOvered != null) {
          this.highlightParcours(parcoursMouseOvered.concat(this.state.currentParcours));
        }
      }
    }

    onMouseOutNode = (nodeId, node) => {
      /** Only currentParcours should stays highlighted **/
      /* Remove parcours highlight from all nodes and links */
      this.removeAllHighlightParcours();
      /* Re-highlight the nodes of currentParcours if currentParcours not null*/
      if(this.state.currentParcours != null) { 
        this.highlightParcours(this.state.currentParcours);
      };
    }

    /***** HIGHLIGHT FUNCTIONS *****/
    
    highlightParcours(parcours) {

      const nodes = this.state.nodes;

      /*** Initialization: set notInParcours state for all ***/
      nodes.forEach((node) => document.querySelector(`[id="${node.id}"] section`).classList.add("notInParcours"));
      data.links.forEach((link) => document.querySelector(`[id="${link.source},${link.target}"]`).classList.add("notInParcours"));

      /*** Change to inParcours state only if conditions met ***/
      parcours.forEach(element => {
        /** Handle node highlighting **/
        nodes.forEach((node) => {
          let htmlNode = document.querySelector(`[id="${node.id}"] section`);
          if (node.parcours != null && node.parcours.indexOf(element) !== -1) { // if node is in the parcours
            htmlNode.classList.remove("notInParcours");
            htmlNode.classList.add("inParcours");
          }
        });
        /** Handle link highlighting **/
        data.links.forEach((link) => {
          let htmlLink = document.querySelector(`[id="${link.source},${link.target}"]`);
          if (nodes[link.source].parcours != null // if source node is in a parcours
            && nodes[link.target].parcours != null // if target node is in a parcours
            && nodes[link.source].parcours.indexOf(element) !== -1 // if current node's parcours matches one of source's parcours
            && nodes[link.target].parcours.indexOf(element) !== -1 // if current node's parcours matches one of target's parcours
          ) {
            htmlLink.classList.remove("notInParcours");
            htmlLink.classList.add("inParcours");
          }
        });
      });
    }

    removeAllHighlightParcours() {
      /* Remove node highlighting */
      data.nodes.forEach( (node) => {
        let htmlNode = document.querySelector(`[id="${node.id}"] section`);
        htmlNode.classList.remove("notInParcours"); 
        htmlNode.classList.remove("inParcours"); 
      });
    
      /* Remove link highlighting */
      data.links.forEach( (link) => {
        let htmlLink = document.querySelector(`[id="${link.source},${link.target}"]`);
        htmlLink.classList.remove("notInParcours"); 
        htmlLink.classList.remove("inParcours"); 
      });
    }

    highlightCurrentNode(nodeId) {
      let htmlNode = document.querySelector(`[id="${nodeId}"] section`);
      htmlNode.classList.add('currentNode');
    }

    removeAllHighlightCurrentNode() {
      this.state.nodes.forEach( node => {
        let htmlNode = document.querySelector(`[id="${node.id}"] section`);
        htmlNode.classList.remove('currentNode');
      });
    }


    // ************************************************************* 

    render() {
      myConfig.width = this.state.width;
      myConfig.height = this.state.height;
      myConfig.node.viewGenerator = this.customNodeGenerator;
      myConfig.initialZoom = this.state.zoom;
      myConfig.freezeAllDragEvents = this.state.freeze;

        return(
          <div className="Graph" style = {{backgroundImage :  "url(" + Background + ")"}}>
            {<Zoom data={
              {zoom:this.state.zoom, zoomCursorValue: this.zoomCursorValue.bind(this) }
            }
            />}
            <Graph
              id = 'id'
              data = {{nodes : this.state.nodes, links: this.state.links, focusedNodeId: this.state.focusedNodeId}}
              config = {myConfig}
              onClickNode = {this.nodeClick}
              onNodePositionChange = {this.savePosition}
              onClickGraph = {() => {console.log(this.state.nodes);}}
              onZoomChange = {this.zoomChange}
              onClickLink = {this.onClickLink}
              onMouseOverNode={this.onMouseOverNode}
              onMouseOutNode={this.onMouseOutNode}
            />
          </div>
        )
    }
};





    
export default Trails