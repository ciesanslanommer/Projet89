import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json'
import CustomNode from './CustomNode.js'
import Background from './assets/fond.png';


const myConfig = {
    nodeHighlightBehavior: true,
    disableLinkForce: true,
    width:400,
    initialZoom: 2,
    maxZoom: 2,
    minZoom: 2,
    staticGraphWithDragAndDrop : true,
    highlightDegree : 0,
    node: {
      color: "lightgreen",
      size: 1200,
      highlightStrokeColor: "blue",
      renderLabel : false,
    },
    link: {
      opacity : 0.3
    },
  }; 

   
class Trails extends Component {
    constructor(props){
      super(props)
      data.nodes.forEach( node => { //randomize nodes position
        // node.x = Math.floor(Math.random()* 1000)
        // node.y = Math.floor(Math.random()* 1000)
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
    nodeClick = (nodeId, e) => {
      //visited node
      let visitedNode = [...this.state.nodes]
      let currentNodeVisited = {...visitedNode[nodeId]}
      currentNodeVisited.visited = true
      visitedNode[nodeId] = currentNodeVisited;
      this.setState({nodes:visitedNode})
      this.props.nodeClick(nodeId)
    };

    savePosition = (nodeId, x,y, e)=>{
      var copy = [...this.state.nodes]
      var item = {...copy[nodeId]};
      item.x = x;
      item.y = y;
      copy[nodeId] = item;
      this.setState({nodes : copy});
    }

    customNodeGenerator(node){
      return <CustomNode node={node} />;
    }
    
    // ************************************************************* 

    render() {
      myConfig.width = this.state.width;
      myConfig.height = this.state.height;
      myConfig.node.viewGenerator = this.customNodeGenerator;
        return(
          <div className="Graph" style = {{backgroundImage :  "url(" + Background + ")"}}>
            <Graph
              id='id'
              data =  {{nodes : this.state.nodes, links: this.state.links}}
              config= {myConfig}
              onClickNode={this.nodeClick}
              onNodePositionChange={this.savePosition}
              onClickGraph = {() => {console.log(this.state.nodes);}}
            />
          </div>
        )
    }
}






    
export default Trails