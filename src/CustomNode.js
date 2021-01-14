//import {Node} from 'react-d3-graph'

function CustomNode({node}){
    let highlighted = node.highlighted
    return(
        <div>
            {highlighted ?
                <img src={require('./assets/photo2.png').default} alt= {node.name}/>
                : <img src={require('./assets/photo1.png').default} alt= {node.name}/>
            }
        </div>
    );
}

export default CustomNode