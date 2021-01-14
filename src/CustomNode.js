//import {Node} from 'react-d3-graph'

function CustomNode({node}){
    return(
        <img src={require('./photo1.png').default} alt= {node.name}></img>
    );
}

export default CustomNode