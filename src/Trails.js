import { Graph } from 'react-d3-graph';
import { React, Component } from 'react';
// import data from './souvenirs.json';
import Background from './assets/fond.png';
import './Trails.css';
import CustomNode from './CustomNode.js';
import Zoom from './Zoom.js';
import Entry from './Entry.js';

const myConfig = {
  nodeHighlightBehavior: true,
  width: 400,
  initialZoom: 1,
  staticGraphWithDragAndDrop: false,
  //staticGraph : true,
  highlightDegree: 0,
  // minZoom: 0,
  // maxZoom: 2,
  focusZoom: 1,
  focusAnimationDuration: 0.75,
  // directed : true,
  freezeAllDragEvents: false,
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

class Trails extends Component {
  constructor(props) {
    super(props);
    //this.zoomCursorValue = this.getZoomValue.bind(this);
    // data.nodes.forEach((node) => {
    //   //randomize nodes without position
    //   if (!node.x) {
    //     node.x = Math.floor(Math.random() * 1000);
    //     node.y = Math.floor(Math.random() * 1000);
    //   }
    //   node.visited = false;
    //   node.visible = true;
    //   if (!node.zoom) node.zoom = 0.1;
    // });

    console.log(this.props.nodes);
    console.log(this.props.links);
    this.state = {
      nodes: this.formatNodes(
        this.props.nodes,
        this.props.trails,
        this.props.trailsByMemory
      ),
      links: this.props.links,
      focusedNodeId: null,
      width: 0,
      height: 0,
      zoom: 0.2,
      currentParcours: null,
      freeze: false,
    };
  }

  formatNodes(nodes, trail, trailByMemory) {
    nodes.forEach((node) => {
      node.visited = false;
      node.visible = true;
      if (!node.pos_x) {
        node.pos_x = Math.floor(Math.random() * 1000);
        node.pos_y = Math.floor(Math.random() * 1000);
      }
      node.x = node.pos_x;
      node.y = node.pos_y;

      node.entry = false;
      delete node.pos_x;
      delete node.pos_y;
      if (!node.zoom) node.zoom = 0.1;
      node.path = '2020_17 avril 20h38_Poème89.txt';
      node.trails = [];
      if (trailByMemory[node.id])
        trailByMemory[node.id].forEach((el) => node.trails.push(el.name));
    });
    trail.forEach((trail) => {
      if (!trail.zoom) trail.zoom = 0.1;
      trail.entry = true;
    });
    console.log(nodes.concat(trail));
    return nodes.concat(trail);
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
  }
  measure = (e) => {
    let rect = {
      width: document.getElementsByClassName('Graph')[0].clientWidth,
      height: document.getElementsByClassName('Graph')[0].clientHeight,
    };

    if (this.state.width !== rect.width || this.state.height !== rect.height) {
      this.setState({
        width: rect.width,
        height: rect.height,
      });
    }
    console.log('MEASURE');
    console.log('html graph: ' + rect.width);
    console.log('state width: ' + this.state.width);
  };
  // ************************************************************* UTILS
  getNodesAndId = (nodeId) => {
    let nodes = [];
    this.state.nodes.forEach((node) => nodes.push({ ...node }));

    //find current node
    let id = nodes.findIndex((node) => node.id === Number(nodeId));
    return { cpy: nodes, id: id };
  };

  // ************************************************************* EVENT
  nodeClick = (nodeId, e) => {
    let { cpy, id } = this.getNodesAndId(nodeId);
    let currentNodeVisited = cpy[id];

    // set it to visited
    if (nodeId === this.props.currentMemory) {
      console.log('TEST');
      this.focusOnNode(this.props.currentMemory);
    }
    currentNodeVisited.visited = true;

    //change obj in copy
    cpy[id] = currentNodeVisited;

    //set state
    this.setState({ nodes: cpy });
    this.props.nodeClick(nodeId);
  };

  zoomChange = (prevZoom, newZoom, e) => {
    // console.log(newZoom);
    this.setState({ zoom: newZoom });
  };

  zoomCursorValue = (zoomValue) => {
    this.setState({ zoom: zoomValue });
  };

  savePosition = (nodeId, x, y, e) => {
    //const allNodes = this.state.nodes.concat(data.trails);
    const { cpy, id } = this.getNodesAndId(nodeId);
    if (cpy[id].entry) {
      return;
    }
    var copy = [...this.state.nodes];
    var item = { ...copy[nodeId] };
    item.x = x;
    item.y = y;
    copy[nodeId] = item;
    this.setState({ nodes: copy });
  };

  customNodeGenerator = (node) => {
    // if(node.highlighted) {
    //   return <Node cx = {node.x} cy = {node.y} fill='green' size = '2000' type = 'square' className = 'node'/>
    // }
    return (
      <div>
        {node.entry ? (
          <Entry name={node.trails} path={node.path} />
        ) : (
          <CustomNode
            name={node.name}
            nature={node.nature}
            highlighted={node.highlighted}
            visited={node.visited}
            zoom={this.state.zoom}
            nodeZoom={node.zoom}
          />
        )}
      </div>
    );
  };

  componentDidUpdate(prevProps, prevState) {
    /*** If currentMemory changes  ***/
    console.log(prevProps.currentMemory, this.props.currentMemory);
    if (prevProps.currentMemory !== this.props.currentMemory) {
      const { cpy, id } = this.getNodesAndId(this.props.currentMemory);
      const currentParcours = cpy[id].trails;

      /** Handle parcours highlighting **/
      /* Initialization: clean parcours highlight and set currentParcours to currentMemory's parcours */
      // this.setState({ currentParcours: currentParcours });
      this.removeAllHighlightParcours();
      /* If the current node is in a parcours, highlight all nodes in the parcours */

      if (currentParcours != null) {
        this.highlightParcours(currentParcours);
      }

      /** Highlights currentNode **/
      this.removeAllHighlightCurrentNode();
      if (this.props.currentMemory != null) {
        this.highlightCurrentNode(this.props.currentMemory);
      }

      /* Handle focus on current node */
      this.focusOnNode(this.props.currentMemory);
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
      if (this.state.focusedNodeId !== null) {
        this.setState({ zoom: myConfig.focusZoom });
        this.setState({ focusedNodeId: null });
        this.setState({ freeze: false });
      }
    }, myConfig.focusAnimationDuration + 1000);
  }

  onMouseOverNode = (nodeId, node) => {
    const { cpy, id } = this.getNodesAndId(nodeId);
    const currentId = this.getNodesAndId(this.props.currentMemory).id;
    console.log(currentId);
    /** If document isn't open **/
    /* currentParcours stays highlighted and parcours mouse overed becomes highlighted */
    /** If document is open, mouse over shouldn't highlight parcours **/
    if (!this.props.docOpen && !node.entry) {
      const parcoursMouseOvered = cpy[id].trails;
      let currentParcours = [];
      if (currentId !== -1) currentParcours = cpy[currentId].trails;
      if (parcoursMouseOvered != null) {
        this.highlightParcours(parcoursMouseOvered.concat(currentParcours));
      }
    }
  };

  onMouseOutNode = (nodeId, node) => {
    const { cpy, currentId } = this.getNodesAndId(this.props.currentMemory);
    console.log(currentId);
    /** Only currentParcours should stays highlighted **/
    /* Remove parcours highlight from all nodes and links */
    this.removeAllHighlightParcours();
    /* Re-highlight the nodes of currentParcours if currentParcours not null*/
    let currentParcours;
    if (currentId) currentParcours = cpy[currentId].trails;
    if (currentParcours) {
      this.highlightParcours(currentParcours);
    }
  };

  /***** HIGHLIGHT FUNCTIONS *****/

  highlightParcours(parcours) {
    const nodes = this.state.nodes;
    /*** Initialization: set notInParcours state for all ***/
    nodes.forEach((node) =>
      document
        .querySelector(`[id="${node.id}"] section`)
        .classList.add('notInParcours')
    );
    this.state.links.forEach((link) =>
      document
        .querySelector(`[id="${link.source},${link.target}"]`)
        .classList.add('notInParcours')
    );

    /*** Change to inParcours state only if conditions met ***/
    parcours.forEach((element) => {
      /** Handle node highlighting **/
      nodes.forEach((node) => {
        let htmlNode = document.querySelector(`[id="${node.id}"] section`);
        if (node.trails != null && node.trails.indexOf(element) !== -1) {
          // if node is in the parcours
          htmlNode.classList.remove('notInParcours');
          htmlNode.classList.add('inParcours');
        }
      });
      /** Handle link highlighting **/
      this.state.links.forEach((link) => {
        let htmlLink = document.querySelector(
          `[id="${link.source},${link.target}"]`
        );
        const sourceid = this.getNodesAndId(link.source).id;
        const targetid = this.getNodesAndId(link.target).id;
        if (
          nodes[sourceid].trails != null && // if source node is in a parcours
          nodes[targetid].trails != null && // if target node is in a parcours
          nodes[sourceid].trails.indexOf(element) !== -1 && // if current node's parcours matches one of source's parcours
          nodes[targetid].trails.indexOf(element) !== -1 // if current node's parcours matches one of target's parcours
        ) {
          htmlLink.classList.remove('notInParcours');
          htmlLink.classList.add('inParcours');
        }
      });
    });
  }

  removeAllHighlightParcours() {
    /* Remove node highlighting */
    this.state.nodes.forEach((node) => {
      let htmlNode = document.querySelector(`[id="${node.id}"] section`);
      htmlNode.classList.remove('notInParcours');
      htmlNode.classList.remove('inParcours');
    });

    /* Remove link highlighting */
    this.state.links.forEach((link) => {
      let htmlLink = document.querySelector(
        `[id="${link.source},${link.target}"]`
      );
      htmlLink.classList.remove('notInParcours');
      htmlLink.classList.remove('inParcours');
    });
  }
  onClickGraph = (event, e) => {
    console.log('click graph');
    if (!this.props.docOpen) {
      this.removeAllHighlightParcours();
    }
  };

  highlightCurrentNode(nodeId) {
    let htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    htmlNode.classList.add('currentNode');
  }

  removeAllHighlightCurrentNode() {
    this.state.nodes.forEach((node) => {
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

    return (
      <div
        className='Graph'
        style={{ backgroundImage: 'url(' + Background + ')' }}
      >
        <Zoom zoomCursorValue={this.zoomCursorValue} zoom={this.state.zoom} />
        <Graph
          id='id'
          data={{
            nodes: this.state.nodes,
            links: this.state.links,
            focusedNodeId: this.state.focusedNodeId,
          }}
          config={myConfig}
          onClickNode={this.nodeClick}
          onNodePositionChange={this.savePosition}
          // // onClickGraph = {() => {console.log(this.state.nodes);}}
          onZoomChange={this.zoomChange}
          onMouseOverNode={this.onMouseOverNode}
          onMouseOutNode={this.onMouseOutNode}
          onClickGraph={this.onClickGraph}
        />
      </div>
    );
  }
}

export default Trails;
