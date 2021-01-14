//import {Node} from 'react-d3-graph'

function CustomNode({node}){
    let highlighted = node.highlighted
    let format = node.format
    function Format(format, highlighted) {
        let id = 1 
        highlighted ? id = 2 : id = 1
        switch (format) {
            case 'jpg':
                return <img src={require('./assets/photo' + id + '.png').default} alt= {node.name}/>
            case 'txt':
                return <img src={require('./assets/texte' + id + '.png').default} alt= {node.name}/>
            default :
                return <img src={require('./assets/texte' + id + '.png').default} alt= {node.name}/>
            }
    }
    return(
        <div>
            {Format(format, highlighted)}
        </div>
    );
}

export default CustomNode


/* { format == "jpg" ?
highlighted ? 
   <img src={require('./assets/photo2.png').default} alt= {node.name}/>
   : <img src={require('./assets/photo1.png').default} alt= {node.name}/>
:
highlighted ? 
   <img src={require('./assets/texte2.png').default} alt= {node.name}/>
   : <img src={require('./assets/texte1.png').default} alt= {node.name}/>

}*/