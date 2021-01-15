import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json'
import CustomNode from './CustomNode.js'
import Background from './assets/fond.png';


const myConfig = {
    nodeHighlightBehavior: true,
    directed: true,
    disableLinkForce: true,
    width:400,
    initialZoom: 2,
    maxZoom: 2,
    minZoom: 2,
    staticGraph : true,
    highlightDegree : 0,
    d3: {
      gravity: -1000,
    },
    node: {
      color: "lightgreen",
      size: 1200,
      highlightStrokeColor: "blue",
      renderLabel : false,
    },
    link: {
      highlightColor: "lightblue",
    },
  }; 

   
class Trails extends Component {
    constructor(props){
      super(props)
      data.nodes.forEach( node => { //randomize nodes position
        node.x = Math.floor(Math.random()* 1000)
        node.y = Math.floor(Math.random()* 1000)
        node.visited = false
      })
      this.state = {
        nodes: data.nodes,
        links: data.links,
        width: 0, height : 0,
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
    NodeClick = (nodeId, e) => {
      //visited node
      let visitedNode = [...this.state.nodes]
      let currentNodeVisited = {...visitedNode[nodeId]}
      currentNodeVisited.visited = true
      visitedNode[nodeId] = currentNodeVisited;
      this.setState({nodes:visitedNode})
      console.log(this.state.nodes[nodeId])
      console.log(visitedNode[nodeId])
      this.props.nodeClick(nodeId)
    };
    
    CustomNodeGenerator(node){
      return <CustomNode node={node} />;
    }
    
    // ************************************************************* 

    render() {
      myConfig.width = this.state.width;
      myConfig.height = this.state.height;
      myConfig.node.viewGenerator = this.CustomNodeGenerator;
        return(
          <div className="Graph" style = {{backgroundImage :  "url(" + Background + ")"}}>
            <Graph
              id='id'
              data =  {{nodes : this.state.nodes, links: this.state.links}}
              config= {myConfig}
              onClickNode={this.NodeClick}
            />
          </div>
        )
    }
}






    
export default Trails