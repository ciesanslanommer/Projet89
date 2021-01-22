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
    focusZoom : 1,
    focusAnimationDuration : 0.75,
    directed : false,
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
        //
        node.visited = false
        node.visible = true
        if (!node.zoom)
          node.zoom = 0.1
        })
      this.state = {
        nodes: data.nodes,
        links: data.links,
        //focusedNodeId: "10",
        width: 0, height : 0,
        zoom : 0.2,
        currentParcours : null,
      };
    };

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
    }
    // ************************************************************* 

    // ************************************************************* EVENT
    nodeClick = (nodeId, e) => {
      //visited node
      let visitedNode = [...this.state.nodes]
      let currentNodeVisited = {...visitedNode[nodeId]}
      //let currentNodeVisited = visitedNode.filter(node => node.id === nodeId)
      console.log(currentNodeVisited)
      currentNodeVisited.visited = true
      visitedNode[nodeId] = currentNodeVisited
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
        console.log(this.props.currentMemory);
        if(this.props.currentMemory != null) { 
          this.highlightCurrentNode(this.props.currentMemory);
        }

      }
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
      console.log('HERE');
      console.log(htmlNode);
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

        return(
          <div className="Graph" style = {{backgroundImage :  "url(" + Background + ")"}}>
            {<Zoom data={
              {zoom:this.state.zoom, zoomCursorValue: this.zoomCursorValue.bind(this) }
            }
            />}
            <Graph
              id = 'id'
              data = {{nodes : this.state.nodes, links: this.state.links/*, focusedNodeId: "10"*/}}
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