import { Graph } from "react-d3-graph";
import {React, Component} from 'react';
import data from './souvenirs.json'

const myConfig = {
    nodeHighlightBehavior: true,
    directed: true,
    disableLinkForce: true,
    width:400,
    d3: {
      gravity: -2000,
    },
    node: {
      color: "lightgreen",
      size: 1200,
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
        width: 0, height : 0
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
    componentDidUpdate (){
      this.measure();
    }
    measure = e => {
      let rect = {width : document.getElementsByClassName("Graph")[0].clientWidth, height: document.getElementsByClassName("Graph")[0].clientHeight};
      console.log(rect);
      if(this.state.width !== rect.width || this.state.height !== rect.height){
         this.setState({
                width: rect.width, 
                height: rect.height
             });
      }
    }
    // ************************************************************* 

    // ************************************************************* EVENT
    
    
    // ************************************************************* 

    render() {

        let modData = { ...this.state.data }; //copy state.data
        let selectNode = modData.nodes.filter(item => { //find node selected
            return item.id === this.props.currentNode;
        });
        selectNode.forEach(item => {//set it to red
            item.color = "red";
        });
        
      // const displayMemoryTest = function(nodeId, node) {
      //   console.log(data.nodes[nodeId].name);
      //   alert(`Affiche le souvenir du noeud ${modData.nodes[nodeId].name}`);
      //  };

      myConfig.width = this.state.width;
      myConfig.height = this.state.height;
        return(
          <div className="Graph" ref={(container)=>{this.container = container}} >
            <Graph
              id="graph-id"
              data =  {this.state.data}
              config= {myConfig}
              //onClickNode={displayMemoryTest}
              //onMouseOverNode={displayMemoryTest}
            />
          </div>
        )
    }
}






    
export default Trails