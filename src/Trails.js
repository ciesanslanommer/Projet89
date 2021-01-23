import { Graph } from 'react-d3-graph';
import { React, PureComponent } from 'react';
import data from './souvenirs.json';
import Background from './assets/fond.png';
import './Trails.css';
import CustomNode from './CustomNode.js';
import Zoom from './Zoom.js';
import Entry from './Entry.js';


const myConfig = {
  nodeHighlightBehavior: true,
  width: 400,
  initialZoom: 1,
  //staticGraphWithDragAndDrop: false,
  staticGraph : false,
  highlightDegree: 0,
  minZoom: 0.1,
  maxZoom: 3,
  focusZoom: 1,
  focusAnimationDuration: 0.75,
  freezeAllDragEvents: true,
  node: {
    color: 'lightgreen',
    size: 1600,
    highlightStrokeColor: 'blue',
    renderLabel: false,
  },
  link: {
    color: 'rgba(255, 255, 255, 1)',
    type: 'CURVE_SMOOTH',
  },
  d3: {
    disableLinkForce: false,
    gravity: -1000,
  },
};

class Trails extends PureComponent {
  constructor(props) {
    super(props);
    data.nodes.forEach((node) => {
      //randomize nodes without position
      if (!node.x) {
        node.x = Math.floor(Math.random() * 1000);
        node.y = Math.floor(Math.random() * 1000);
      }
      //
      node.visited = false;
      node.visible = true;
      if (!node.zoom) {
        node.zoom = 0.1;
      }

    });
    this.state = {
      nodes: data.nodes,
      links: data.links,
      focusedNodeId: null,
      width: 0, height: 0,
      zoom: 0.2,
      freeze: false,
      customZoomsToIgnore: []
    };
  }

  // ************************************************************* RESIZING
  componentWillMount() {
    window.addEventListener('resize', this.measure, false);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measure, false);
  }
  componentDidMount() {
    this.measure();
    setTimeout(() => {
      myConfig.staticGraph = true;
      myConfig.freeze = false;
    }, 1000);
  }
  measure = (e) => {
    let rect = {width: document.getElementsByClassName('Graph')[0].clientWidth, height: document.getElementsByClassName('Graph')[0].clientHeight};

    if (this.state.width !== rect.width || this.state.height !== rect.height) {
      this.setState({
        width: rect.width,
        height: rect.height,
      });
    }
  }
  // *************************************************************

  // ************************************************************* EVENT
  nodeClick = (nodeId, node, e) => {
    
    if(node.entry) {
      return;
    }
   
    if (nodeId === this.props.currentMemory) {
      this.focusOnNode(this.props.currentMemory);
    }
    //visited node
    let visitedNode = [...this.state.nodes];
    let currentNodeVisited = { ...visitedNode[nodeId] };
    //let currentNodeVisited = visitedNode.filter(node => node.id === nodeId)
    //console.log(currentNodeVisited);
    currentNodeVisited.visited = true;
    visitedNode[nodeId] = currentNodeVisited;
    this.setState({ nodes: visitedNode });
    this.props.nodeClick(nodeId);


  }

  savePosition = (nodeId, x, y, e) => {

    const allNodes = this.state.nodes.concat(data.trails);
    if (allNodes[nodeId].entry) {
      return;
    }
    var copy = [...this.state.nodes];
    var item = { ...copy[nodeId] };
    item.x = x;
    item.y = y;
    copy[nodeId] = item;
    this.setState({ nodes: copy });
  }

  customNodeGenerator = (node) => {
    // if(node.highlighted) {
    //   return <Node cx = {node.x} cy = {node.y} fill='green' size = '2000' type = 'square' className = 'node'/>
    // }

    return (
      <div>
        {
          node.entry ? 
            <Entry
              name={node.parcours}
              path={node.path}
            /> :
            <CustomNode
              name={node.name}
              nature={node.nature}
              highlighted={node.highlighted}
              visited={node.visited}
              zoom={this.state.zoom}
              nodeZoom={node.zoom}
            />
        }
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    /*** If currentMemory changes  ***/
    if (prevProps.currentMemory !== this.props.currentMemory) {

      /** Initialization: clean all highlight **/
      this.removeAllHighlightParcours();
      this.removeAllHighlightCurrentNode();

      if (this.props.currentMemory != null) {

        /** Highlights and focus on currentNode **/
        this.highlightNode(this.props.currentMemory);
        this.focusOnNode(this.props.currentMemory);

        /** Handle parcours highlighting **/
        /* If the current node is in a parcours, highlight all nodes in the parcours */
        const currentParcours = this.state.nodes[this.props.currentMemory].parcours;
        if(currentParcours != null) {
          this.highlightParcours(currentParcours);
        }
      }

    }

    /*** After opening a doc, if resize window then close doc ***/
    /*** Graph does not resize ***/
    /*** So added below to solve the problem ***/
    if (prevProps.docOpen !== this.props.docOpen) {
      this.measure();
    }
    
  }

  focusOnNode(nodeId) {

    /* The svg container size isn't updated yet ? So use measure method */
    /* Position of node is centered from the get go but animation is cut */
    this.measure();

    /* Must disable user zoom before setting focus*/
    this.setState({ freeze: true });
    /** Change Node focus **/
    this.setState({ focusedNodeId: nodeId });
    /* Wait the duration of the focusAnimation before setting focus to null */
    /* Else when user zoom, it will create problem */
    setTimeout(() => {
        this.setState({ zoom: myConfig.focusZoom });
        this.setState({ focusedNodeId: null });
        this.setState({ freeze: false });
    }, myConfig.focusAnimationDuration + 1000);
  }

  onMouseOverNode = (nodeId, node) => {
    /** If document isn't open **/
    /* currentParcours stays highlighted and parcours mouse overed becomes highlighted */
    /** If document is open, mouse over shouldn't highlight parcours **/
    if (!this.props.docOpen && !node.entry) {
      const parcoursMouseOvered = this.state.nodes[nodeId].parcours;
      const currentParcours = this.props.currentMemory == null ? null : this.state.nodes[this.props.currentMemory].parcours;
      
      if(parcoursMouseOvered != null) {
        /* Must do concatenation else only one parcours will be highlighted */
        /* So all parcours we want highlighted must be done with one call to the function */
        this.highlightParcours(parcoursMouseOvered.concat(currentParcours));
      }
      else {
        this.highlightNode(nodeId);
      }

    }
  }

  onMouseOutNode = (nodeId, node) => {
    /** Only currentParcours should stays highlighted **/
    /* Remove parcours highlight from all nodes and links */
    this.removeAllHighlightParcours();
    /* Re-highlight the nodes of currentParcours if currentParcours not null*/
    const currentParcours = this.props.currentMemory == null ? null : this.state.nodes[this.props.currentMemory].parcours;
    if (currentParcours != null) {
      this.highlightParcours(currentParcours);
    };
  }

  /***** HIGHLIGHT FUNCTIONS *****/

  highlightParcours(parcours) {

    if(parcours == null){
      return;
    }

    const nodes = this.state.nodes.concat(data.trails);

    /*** Initialization: set notInParcours state for all ***/
    nodes.forEach((node) => document.querySelector(`[id="${node.id}"] section`).classList.add("notInParcours"));
    data.links.forEach((link) => document.querySelector(`[id="${link.source},${link.target}"]`).classList.add("notInParcours"));

    /*** Change to inParcours state only if conditions met ***/
    parcours.forEach((element) => {
      /** Handle node highlighting **/
      nodes.forEach((node) => {
        let htmlNode = document.querySelector(`[id="${node.id}"] section`);
        if (node.parcours != null && node.parcours.indexOf(element) !== -1) { // if node is in the parcours
          htmlNode.classList.remove('notInParcours');
          htmlNode.classList.add('inParcours');
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
    data.nodes.forEach((node) => {
      let htmlNode = document.querySelector(`[id="${node.id}"] section`);
      htmlNode.classList.remove('notInParcours');
      htmlNode.classList.remove('inParcours');
    });

    /* Remove link highlighting */
    data.links.forEach((link) => {
      let htmlLink = document.querySelector(`[id="${link.source},${link.target}"]`);
      htmlLink.classList.remove('notInParcours');
      htmlLink.classList.remove('inParcours');
    });
  }

  highlightNode(nodeId) {
    console.log('highlightnode');
    let htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    if(nodeId == this.props.currentMemory) {
      htmlNode.classList.add('currentNode');
    }
    else {
      htmlNode.classList.remove('notInParcours');
      htmlNode.classList.add('inParcours');
    }
    
  }

  removeAllHighlightCurrentNode() {
    this.state.nodes.forEach((node) => {
      let htmlNode = document.querySelector(`[id="${node.id}"] section`);
      htmlNode.classList.remove('currentNode');
    });
  }

  onClickGraph = (event, e) => {
    if (!this.props.docOpen) {
      this.removeAllHighlightParcours();
      this.props.unsetCurrentMemory();
    }
  }

  // event handler for zoom changed from the slider
  onCustomZoomChange = (event) => {
    console.log("onCustomZoomChange", event.target.value)
    if (!this.state.deactivateReactZoom) {
      this.setState(prevState => ({
        zoom: parseFloat(event.target.value),
         // remember this zoom value so that we can prevent double event handling in d3 handler
        customZoomsToIgnore: [...this.state.customZoomsToIgnore, event.target.value],
      }));
    }
  }

  // event handler for zoom changed from d3 (wheel)
  onD3ZoomChange = (prevZoom, newZoom, e) => {
    console.log("onD3ZoomChange:", prevZoom, "=>", newZoom)
    const strZoom = ""+newZoom;
    // if this zoom value was already handled by the slider, do not set new zoom value to prevent infinite re-rendering
    if (this.state.customZoomsToIgnore.includes(strZoom)) {
      this.setState(prevState => ({
        customZoomsToIgnore: prevState.customZoomsToIgnore.filter(customZoom => customZoom !== strZoom)
      }))
    } else if (!this.state.deactivateD3Zoom) {
      this.setState({
        deactivateReactZoom: true,
        zoom: newZoom,
      });
    }
  };

  // event handler for slider zoom start:  disable d3 zoom
  onCustomZoomMouseDown = (event) => {
    console.log("onCustomZoomMouseDown", event.target.value)
    this.setState({
      deactivateReactZoom: false,
      deactivateD3Zoom: true,
      customZoomsToIgnore: [],
    })
  }

  // event handler for slider zoom end: re-enable d3 zoom
  onCustomZoomMouseUp = (event) => {
    console.log("onCustomZoomMouseUp", event.target.value)
    this.setState({
      deactivateReactZoom: true,
      deactivateD3Zoom: false,
    })
  }

    // ************************************************************* 

  render() {
    console.log("trails render")
    myConfig.width = this.state.width;
    myConfig.height = this.state.height;
    myConfig.node.viewGenerator = this.customNodeGenerator;
    myConfig.initialZoom = this.state.zoom;
    myConfig.freezeAllDragEvents = this.state.freeze;

    return (
      <div className="Graph" style={{ backgroundImage: "url(" + Background + ")" }}>
        <Zoom
          zoom={this.state.zoom}
          onChange={this.onCustomZoomChange}
          onMouseDown={this.onCustomZoomMouseDown}
          onMouseUp={this.onCustomZoomMouseUp}
        />
        <Graph
          id='id'
          data={{ nodes: this.state.nodes.concat(data.trails), links: this.state.links, focusedNodeId: this.state.focusedNodeId }}
          config={myConfig}
          onClickNode={this.nodeClick}
          onNodePositionChange={this.savePosition}
          // // onClickGraph = {() => {console.log(this.state.nodes);}}
          onZoomChange={this.onD3ZoomChange}
          onMouseOverNode={this.onMouseOverNode}
          onMouseOutNode={this.onMouseOutNode}
          onClickGraph={this.onClickGraph}
        />
      </div>
    )
  }
};





    
export default Trails
