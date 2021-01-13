import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json'

const myConfig = {
    nodeHighlightBehavior: true,
    directed: true,
    width:400,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
    },
  }; 
   
class Trails extends Component {
    constructor(props){
      super(props)

        this.state = {
        data: data,
        };
    };

    render() {

        let modData = { ...this.state.data }; //copy state.data
        let selectNode = modData.nodes.filter(item => { //find node selected
            return item.id === this.props.currentNode;
        });
        selectNode.forEach(item => {//set it to red
            item.color = "red";
        });
        
      
      const displayMemoryTest = function(nodeId, node) {
        console.log(data.nodes[nodeId].name);
        alert(`Affiche le souvenir du noeud ${modData.nodes[nodeId].name}`);
       };

        return(
            <Graph
            id="graph-id"
            data =  {this.state.data}
            config= {myConfig}
            //onClickNode={displayMemoryTest}
            onMouseOverNode={displayMemoryTest}
        />
        )
    }
}






    
export default Trails