import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json'
import Background from './assets/fond.png';
import "./Trails.css";
import CustomNode from './CustomNode.js'


const myConfig = {
    nodeHighlightBehavior: true,
    disableLinkForce: true,
    width:400,
    initialZoom: 1,
    staticGraphWithDragAndDrop : true,
    //staticGraph : true,
    highlightDegree : 0,
    focusZoom : 1,
    focusAnimationDuration : 0.75,
    directed : true,
    node: {
      color: "lightgreen",
      size: 1600,
      highlightStrokeColor: "blue",
      renderLabel : false,
    },
    link: {
      color : "rgba(255, 255, 255, 1)",
      type : "CURVE_SMOOTH",
    }
  }; 

   
class Trails extends Component {
    constructor(props){
      super(props)
      data.nodes.forEach( node => { //randomize nodes position
        // node.x = Math.floor(Math.random()* 1000)
        // node.y = Math.floor(Math.random()* 1000)
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
        zoom : 0.5,
      };
    };

    // ************************************************************* RESIZING
    componentWillMount () {
      window.addEventListener('resize', this.measure, false);
    }
    componentWillUnmount () {
      window.removeEventListener('resize', this.measure, false);
    }
    componentDidMount (){
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

    zoomChange = (prevZoom, newZoom, e) =>  {
      // console.log(newZoom);
      this.setState({zoom : newZoom});
      
    }


    savePosition = (nodeId, x,y, e)=>{
      var copy = [...this.state.nodes]
      var item = {...copy[nodeId]};
      item.x = x;
      item.y = y;
      copy[nodeId] = item;
      this.setState({nodes : copy});
    }

    customNodeGenerator = (node) =>{
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

    onMouseOverNode = (nodeId, node) => {
      if(!this.props.docOpen)
        this.props.onMouseOverNode(node);
    };

    onMouseOutNode = (nodeId, node) => {
      // this.props.onMouseOutNode(node);
    };


    // ************************************************************* 

    render() {
      myConfig.width = this.state.width;
      myConfig.height = this.state.height;
      myConfig.node.viewGenerator = this.customNodeGenerator;
      myConfig.initialZoom = this.state.zoom;

        return(
          <div className="Graph" style = {{backgroundImage :  "url(" + Background + ")"}}>
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