import { Graph } from 'react-d3-graph';
import { React, PureComponent } from 'react';
import Background from './assets/fond.png';
import './Trails.css';
import CustomNode from './CustomNode.js';
import Zoom from './Zoom.js';
import Entry from './Entry.js';

const myConfig = {
  nodeHighlightBehavior: true,
  width: 400,
  // initialZoom: 1,
  // staticGraphWithDragAndDrop: false,
  staticGraph : false,
  highlightDegree: 0,
  minZoom: 0.1,
  maxZoom: 3,
  focusZoom: 2,
  focusAnimationDuration: 0.75,
  freezeAllDragEvents: true,
  // directed: true,
  node: {
    color: 'lightgreen',
    size: 1000,
    highlightStrokeColor: 'blue',
    renderLabel: false,
  },
  link: {
    color: 'rgba(255, 255, 255, 0.5)',
    type: 'ROUGH',
    offset: 20,
  },
  d3: {
    disableLinkForce: false,
    gravity: -800,
  },
  rough:{
    maxRandomnessOffset: 2,
    roughness: 1.5,
    bowing: 4,
  }
};

let nodesByTrails = {};
let linksByTrails = {};

class Trails extends PureComponent {
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

    // //console.log(this.props.nodes);
    // //console.log(this.props.links);

    this.state = {
      nodes: this.formatNodes(
        this.props.nodes,
        this.props.trails,
        this.props.trailsByMemory
      ),
      links: this.formatLinks(
        this.props.links,
        this.props.trails,
        this.props.nodes
      ),
      focusedNodeId: null,
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: Math.min(Math.max(window.innerHeight / 2200, 0.3), 1), // I don't know why I have to do this but otherwise the graph does not fit inside the window...
      freeze: false,
      customZoomsToIgnore: [],
    };
  }

  formatLinks(links, trails, nodes) {
//    console.log("formatLinks", trails)
    // remove links that are not linked with existing memories
    const formattedLinks = this.props.links.filter(e => this.props.nodes.find(n => e.source === n.id) && this.props.nodes.find(n => e.target === n.id));
    // add first link for each trail
    trails.forEach(e => {
      if (nodes.find(n => n.id === e.target_id)) {
        formattedLinks.push({
          source: /*'trail_' + */e.id,
          target: e.target_id,
        });
      }
    })
    return formattedLinks;
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
      if (typeof trail.id !== 'string' || !trail.id.startsWith('trail_')) {
        trail.id = 'trail_' + trail.id;
      }
    });
    // //console.log(nodes.concat(trail));
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
    /** After 100 ms, graph becomes static **/
    setTimeout(() => {
      myConfig.staticGraph = true;
      myConfig.freeze = false;
    }, 100);
    /** Fill nodesByTrails object **/
    this.fillNodesAndLinksByTrails();

    /** Handle open/close preview **/
    document.querySelectorAll('.node').forEach((node) => {
      const indexNode = this.props.nodes.findIndex((elt) => elt.id === Number(node.id) && !node.querySelector('.iconstrails'));
      const dataNode = this.props.nodes[indexNode];
      const icon = node.querySelector("[class^=icons]");
      if (dataNode) {
        icon.addEventListener('mouseenter', (event) => {
            this.onMouseOverNode(dataNode.id, dataNode);
            this.props.openPreview(node, dataNode.name, dataNode.description, dataNode.entry)
          }
        );
        icon.addEventListener('mouseleave', () => {
          this.onMouseOutNode(dataNode.id, dataNode);
          this.props.closePreview();
        });
        icon.addEventListener('click', () => {
          this.nodeClick(dataNode.id, dataNode);
        });

      } else {
        const indexTrail = this.props.trails.findIndex((elt => /*('trail_' + elt.id)*/elt.id === node.id && !!node.querySelector('.iconstrails')));
        const dataTrail = this.props.trails[indexTrail];
        if (dataTrail) {
          icon.addEventListener('mouseenter', (event) => {
              const parcours = dataTrail.parcours
                ? `PARCOURS ${dataTrail.parcours.toUpperCase()}`
                : 'PARCOURS INCONNU';
              this.onMouseOverNode(dataTrail.id, dataTrail);
              this.props.openPreview(node, parcours, dataTrail.description, dataTrail.entry)
            }
          );
          icon.addEventListener('mouseleave', () => {
            this.onMouseOutNode(dataTrail.id, dataTrail);
            this.props.closePreview();
          });
          icon.addEventListener('click', () => {
            this.nodeClick(dataTrail.id, dataTrail);
          });
        }
      }
    });
    
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
  }

  // ************************************************************* UTILS

  getNodesAndId = (nodeId) => {
    let nodes = [];
    this.state.nodes.forEach((node) => nodes.push({ ...node }));

    //find current node
    let id = nodes.findIndex((node) => node.id === Number(nodeId));
    return { cpy: nodes, id: id };
  }

  fillNodesAndLinksByTrails() {
    /** For each trail **/
    this.props.trails.forEach( (trail) => {
      /* Class nodes by trail*/
      nodesByTrails[trail.parcours] = [];
      nodesByTrails[trail.parcours].push(trail);
      this.props.nodes.forEach( (node) => {
        if(node.trails.indexOf(trail.parcours) !== -1) {
          nodesByTrails[trail.parcours].push(node);
        }
      });
      /* Class links by trail */
      linksByTrails[trail.parcours] = [];
      if(trail.id != null && trail.target_id != null) {
        linksByTrails[trail.parcours].push({source: trail.id, target: trail.target_id});
      }
      this.props.links.forEach( (link) => {
        const sourceIndex = this.getNodesAndId(link.source).id;
        const targetIndex = this.getNodesAndId(link.target).id
        const sourceTrails = sourceIndex === -1 ? null : this.state.nodes[sourceIndex].trails;
        const targetTrails = targetIndex === -1 ? null : this.state.nodes[targetIndex].trails;
        if(sourceTrails != null && sourceTrails.indexOf(trail.parcours) !== -1 &&
        targetTrails != null && targetTrails.indexOf(trail.parcours) !== -1) {
          linksByTrails[trail.parcours].push(link);
        }
      });
    });
  }
  
  NodesAndLinksFromTrails(allTrails) {
    let nodes = [];
    let links = [];
    allTrails.forEach( (trail) => {
      nodes.push(...nodesByTrails[trail]);
      links.push(...linksByTrails[trail]);
    });
    return {nodes: nodes, links: links};
  }

  // ************************************************************* EVENT

  nodeClick = (nodeId, node) => {
    console.log("nodeClick", nodeId, node)
    if ((''+nodeId).startsWith('trail')) {
      this.props.nodeClick(nodeId, 'entry');
    } else {
      let { cpy, id } = this.getNodesAndId(nodeId);
      let currentNodeVisited = cpy[id];

      // set it to visited
      if (nodeId === this.props.currentMemory) {
        this.focusOnNode(this.props.currentMemory);
      }
      currentNodeVisited.visited = true;

      //change obj in copy
      cpy[id] = currentNodeVisited;

      //set state
      this.setState({ nodes: cpy });
      this.props.nodeClick(nodeId, 'memory');
    }
  }

  // savePosition = (nodeId, x, y, e) => {
  //   //const allNodes = this.state.nodes.concat(data.trails);
  //   const { cpy, id } = this.getNodesAndId(nodeId);
  //   if (cpy[id].entry) {
  //     return;
  //   }
  //   var copy = [...this.state.nodes];
  //   var item = { ...copy[nodeId] };
  //   item.x = x;
  //   item.y = y;
  //   copy[nodeId] = item;
  //   this.setState({ nodes: copy });
  // }

  customNodeGenerator = (node) => {
    // if(node.highlighted) {
    //   return <Node cx = {node.x} cy = {node.y} fill='green' size = '2000' type = 'square' className = 'node'/>
    // }
    return node.entry ? (
        <Entry name={node.trails} path={node.path} />
      ) : (
        <CustomNode
          name={node.name}
          nature={node.nature}
          highlighted={node.highlighted}
          visited={node.visited}
          zoom={this.state.zoom}
          nodeZoom={node.zoom}
          path={node.icon_path}
        />
      );
  }

  getCurrentTrails() {
    const { cpy, id } = this.getNodesAndId(this.props.currentMemory);
    // const currentTrail = id !== -1 ? cpy[id].trails : null;
    let currentTrail = null;
    if(id===-1) {
      currentTrail = null;
    }
    else{
      currentTrail = cpy[id].entry ? [cpy[id].parcours] : cpy[id].trails;
    }
    //console.log("HGZGNJRGNRG");
    //console.log(currentTrail);
    return currentTrail;
  }

  componentDidUpdate(prevProps, prevState) {

    /* If currentMemory changes that is click on node or arrow buttons  */
    /* Clean all highlight first */
    /* Highlight and focus on currentNode if not null */
    /* And if belongs to a trail, highlight trail */
    if (prevProps.currentMemory !== this.props.currentMemory) {
      this.removeHighlight();
      this.removeCurrentNode();
      if (this.props.currentMemory != null) {
        const currentTrail = this.getCurrentTrails();
        this.highlightNode(this.props.currentMemory);
        this.focusOnNode(this.props.currentMemory);
        if (currentTrail != null) { this.highlightTrail(currentTrail) }
      }
    }

    /* After opening a doc, if resize window then close doc */
    /* Graph does not resize, so added below to solve the problem */
    if (prevProps.docOpen !== this.props.docOpen) {
      this.measure();
    }
  }

  onMouseOverNode = (nodeId, node) => {
  
    /** If document isn't open **/
    /* highlight current trail and node or trail mouseovered */
    if (!this.props.docOpen) {
      const trailMouseOvered = node.entry ? [node.parcours] : node.trails;
      const cpy = this.getNodesAndId(this.props.currentMemory).cpy;
      const currentId = this.getNodesAndId(this.props.currentMemory).id;
      let currentTrail = [];
      if(currentId !== -1) {
        currentTrail = cpy[currentId].entry ? cpy[currentId].parcours : cpy[currentId].trails;
      }
      if (trailMouseOvered.length !== 0) {
        this.highlightTrail(trailMouseOvered.concat(currentTrail))
      }
      else {
        this.highlightNode(nodeId)
      }
    }
  }
 
  onMouseOutNode = (nodeId, node) => {
    /* Remove highlight for all except currentMemory and currentTrail */
    this.removeHighlight();
    const currentTrail = this.getCurrentTrails();
    if(this.props.currentMemory) { this.highlightNode(nodeId) }
    if(currentTrail) { this.highlightTrail(currentTrail) }
  }

  onClickGraph = (event, e) => {
    // if (!this.props.docOpen) {
    //   this.removeHighlight();
    //   this.props.unsetCurrentMemory();
    // } 
    // else {
    //   this.props.closeDoc();
    // };
    this.removeHighlight();
    this.props.unsetCurrentMemory();
    if(this.props.docOpen) {
      this.props.closeDoc();
    }
  }

  // ************************************************************* FOCUS

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

  // ************************************************************* HIGHLIGHT

  highlightTrail(trails) {
    
    if (trails == null) { return };
    
    /* Search all nodes and links in trails */
    const arrayOfNodes = this.NodesAndLinksFromTrails(trails).nodes;
    const arrayOfLinks = this.NodesAndLinksFromTrails(trails).links;

    /** Handle node highlighting **/
    arrayOfNodes.forEach((node) => {
      let htmlNode = document.querySelector(`[id="${node.id}"] section`);
      htmlNode.classList.add('inTrail');
    });
    /** Handle link highlighting **/
    arrayOfLinks.forEach((link) => {
      let htmlLink = document.querySelector(`[id="${link.source},${link.target}"]`);
      htmlLink.classList.add('inTrail');
    });
  }

  removeHighlight() {
    /* Remove node highlighting */
    let htmlNodes = document.querySelectorAll('.node section');
    htmlNodes.forEach((node) => { 
      node.classList.remove('inTrail');
      //node.classList.remove('currentNode'); 
    })
    /* Remove link highlighting */
    let htmlLinks = document.querySelectorAll('.link');
    htmlLinks.forEach((link) => { link.classList.remove('inTrail') });
  }

  highlightNode(nodeId) {
    let htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    if (nodeId === this.props.currentMemory) { htmlNode.classList.add('currentNode') } 
    else { htmlNode.classList.add('inTrail') }
  }

  removeCurrentNode() {
    let htmlNodes = document.querySelectorAll('.node section');
    if (!htmlNodes) {
      return
    }
    htmlNodes.forEach((node) => { 
      node.classList.remove('currentNode'); 
    })
  }
  
  // ************************************************************* ZOOM

  // event handler for zoom changed from the slider
  onCustomZoomChange = (event) => {
    // //console.log('onCustomZoomChange', event.target.value);
    if (!this.state.deactivateReactZoom) {
      this.setState((prevState) => ({
        zoom: parseFloat(event.target.value),
        // remember this zoom value so that we can prevent double event handling in d3 handler
        customZoomsToIgnore: [
          ...this.state.customZoomsToIgnore,
          event.target.value,
        ],
      }));
    }
  }

  // event handler for zoom changed from d3 (wheel)
  onD3ZoomChange = (prevZoom, newZoom, e) => {
    // //console.log('onD3ZoomChange:', prevZoom, '=>', newZoom);
    const strZoom = '' + newZoom;
    // if this zoom value was already handled by the slider, do not set new zoom value to prevent infinite re-rendering
    if (this.state.customZoomsToIgnore.includes(strZoom)) {
      this.setState((prevState) => ({
        customZoomsToIgnore: prevState.customZoomsToIgnore.filter(
          (customZoom) => customZoom !== strZoom
        ),
      }));
    } else if (!this.state.deactivateD3Zoom) {
      this.setState({
        deactivateReactZoom: true,
        zoom: newZoom,
      });
    }
  }

  // event handler for slider zoom start:  disable d3 zoom
  onCustomZoomMouseDown = (event) => {
    // //console.log('onCustomZoomMouseDown', event.target.value);
    this.setState({
      deactivateReactZoom: false,
      deactivateD3Zoom: true,
      customZoomsToIgnore: [],
    });
  }

  // event handler for slider zoom end: re-enable d3 zoom
  onCustomZoomMouseUp = (event) => {
    // //console.log('onCustomZoomMouseUp', event.target.value);
    this.setState({
      deactivateReactZoom: true,
      deactivateD3Zoom: false,
    });
  }

  // *************************************************************

    render() {
      // //console.log('trails render');
      myConfig.width = this.state.width || window.innerWidth;
      myConfig.height = this.state.height || window.innerHeight;
      myConfig.node.viewGenerator = this.customNodeGenerator;
      myConfig.initialZoom = this.state.zoom;
      myConfig.freezeAllDragEvents = this.state.freeze;
      // style={{ backgroundImage: "url(" + Background + ")" }}

      return (
        <div
          className='Graph'
          style={{ backgroundImage: 'url(' + Background + ')' }}
        >
          <Zoom
            zoom={this.state.zoom}
            onChange={this.onCustomZoomChange}
            onMouseDown={this.onCustomZoomMouseDown}
            onMouseUp={this.onCustomZoomMouseUp}
          />
          <Graph
            id='id'
            data={{
              nodes: this.state.nodes,
              links: this.state.links,
              focusedNodeId: this.state.focusedNodeId,
            }}
            config={myConfig}
            // onClickNode={this.nodeClick}
            // onNodePositionChange={this.savePosition}
            onZoomChange={this.onD3ZoomChange}
            // onMouseOverNode={this.onMouseOverNode}
            // onMouseOutNode={this.onMouseOutNode}
            onClickGraph={this.onClickGraph}
          />
        </div>
      );
    }
}

export default Trails;
