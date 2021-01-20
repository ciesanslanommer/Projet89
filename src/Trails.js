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
  }; 

   
class Trails extends Component {
    constructor(props){
      super(props)
      this.state = {
        nodes: this.formatNodes(this.props.toFormat.noeuds , this.props.toFormat.souvenirs),
        links: this.formatLinks(this.props.toFormat.noeuds),
        width: 0, height : 0,
        zoom : 0.5,
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
      //copy array of obj 
      let visitedNode = []
      this.state.nodes.forEach((node) => visitedNode.push({...node}))

      //find current node
      let id = visitedNode.findIndex(node => node.id === Number(nodeId))
      let currentNodeVisited = visitedNode[id];

      // set it to visited
      currentNodeVisited.visited = true
      
      //change obj in copy
      visitedNode[id] = currentNodeVisited

      //set state
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
              data = {{nodes : this.state.nodes, links: this.state.links}}
              config = {myConfig}
              onClickNode = {this.nodeClick}
              onNodePositionChange = {this.savePosition}
              onClickGraph = {() => {console.log(this.state.nodes);}}
              onZoomChange = {this.zoomChange}
              onClickLink = {this.onClickLink}
            />
          </div>
        )
    }
};





    
export default Trails