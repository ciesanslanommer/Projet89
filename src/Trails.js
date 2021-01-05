import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json'

const myConfig = {
    nodeHighlightBehavior: true,
    directed: true,
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
        console.log(selectNode);
        //this.setState({ data: modData });// change state.data


        return(
            <Graph
            id="graph-id"
            data =  {this.state.data}
            config= {myConfig}
        />
        )
    }
}






    
export default Trails