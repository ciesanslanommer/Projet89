function CustomNode({node}){
    let highlighted = node.highlighted
    let nature = node.nature
    let visited = node.visited
    console.log(node.visited)
    function Format(format, highlighted) {
        let id = highlighted ? 2 : 1
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
    if(visited){
        return(
            <div style = {{backgroundColor : 'red', width : 100, height: 100, borderRadius : 50}}></div>
        )
    }
    else{
        return(
            <div>
                {Format(nature, highlighted)}
            </div>
        );
    }
}

export default CustomNode