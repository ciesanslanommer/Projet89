//import {Node} from 'react-d3-graph'

function CustomNode({node}){
    let highlighted = node.highlighted
    let nature = node.nature
    function Format(nature, highlighted) {
        let id = 1 
        highlighted ? id = 2 : id = 1
        switch (nature) {
            case 'image':
                return <img src={require('./assets/photo' + id + '.png').default} alt= {node.name}/>
            case 'texte':
                return <img src={require('./assets/texte' + id + '.png').default} alt= {node.name}/>
            case 'audio':
                return <img src={require('./assets/audio' + id + '.png').default} alt= {node.name}/>
            default :
                return <img src={require('./assets/texte' + id + '.png').default} alt= {node.name}/>
            }
    }
    return(
        <div>
            {Format(nature, highlighted)}
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