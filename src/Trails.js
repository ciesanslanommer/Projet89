import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json'
import Background from './assets/fond.png';
import * as d3 from "d3";
import "./Trails.css";
import CustomNode from './CustomNode.js'


const myConfig = {
    nodeHighlightBehavior: true,
    disableLinkForce: true,
    width:400,
    initialZoom: 0.5,
    staticGraphWithDragAndDrop : true,
    //staticGraph : true,
    highlightDegree : 0,
    node: {
      color: "lightgreen",
      size: 1600,
      highlightStrokeColor: "blue",
      renderLabel : false,
    },
    link: {
      color : "rgba(255, 255, 255, 1)",
      type : "CURVE_SMOOTH",
      strokeWidth: 1.5,
    },
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
        width: 0, height : 0,
        zoom : 1,
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
      currentNodeVisited.visited = true
      visitedNode[nodeId] = currentNodeVisited;
      this.setState({nodes:visitedNode})
      this.props.nodeClick(nodeId)

      // if node is in a parcours, highlight all nodes in the parcours 
      this.removeHighlightParcours();
      if(currentNodeVisited.parcours != null) {
        this.highlightParcours(currentNodeVisited);
      }

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
      return <CustomNode 
              name = {node.name}
              nature = {node.nature}
              highlighted = {node.highlighted}
              visited = {node.visited}
              zoom = {this.state.zoom}
              nodeZoom = {node.zoom}
            />
    }

    highlightParcours(currentNodeVisited) {

      console.log(currentNodeVisited.id);

      const nodes = this.state.nodes;

      currentNodeVisited.parcours.forEach(element => {

        console.log(element);

        // handle node highlighting
        nodes.forEach((node) => {
          let htmlNode = d3.select(`[id="${node.id}"] div`); // CAUTION : works because only parents of customNodes have numbered id
          //console.log(node.parcours);
          if (node.parcours!=null && node.parcours[0] !== element) {
            htmlNode.attr("class", "unselected");
          }
          else {
            console.log(node.id);
          }
        });

        // handle link highlighting
        this.state.links.forEach((link) => {
          let htmlLink = d3.select(`[id="${link.source},${link.target}"]`);
          if (nodes[link.source].parcours !== element
            || nodes[link.target].parcours !== element
          ) {
            // htmlLink.attr("class", "unselected"); // doesn't work: <path> element already has opacity set
            // myConfig['link'].opacity = 0.2; // doesn't work: change opcaity for all links
            htmlLink.style("opacity", "0.2");
            htmlLink.style("stroke", "red");
          }
        });

      });
      
    }

    removeHighlightParcours() {

      // remove node highlighting
      this.state.nodes.forEach( (node) => {
        let htmlNode = d3.select(`[id="${node.id}"] div`); // CAUTION : works because only parents of customNodes have numbered id
        htmlNode.attr("class", null); 
      });
    
      // remove link highlighting
      this.state.links.forEach( (link) => {
        let htmlLink = d3.select(`[id="${link.source},${link.target}"]`);
        htmlLink.style("opacity", "1");
      });
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
              id='id'
              data =  {{nodes : this.state.nodes, links: this.state.links}}
              config= {myConfig}
              onClickNode={this.nodeClick}
              onNodePositionChange={this.savePosition}
              onClickGraph = {() => {console.log(this.state.nodes);}}
              onZoomChange = {this.zoomChange}
              onClickLink={this.onClickLink}
            />
          </div>
        )
    }
};





    
export default Trails