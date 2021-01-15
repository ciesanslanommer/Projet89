function CustomNode({node}){
    let highlighted = node.highlighted
    let format = node.format
    let visited = node.visited
    console.log(node.visited)
    function Format(format, highlighted) {
        let id = highlighted ? 2 : 1
        switch (format) {
            case 'jpg':
                return <img src={require('./assets/photo' + id + '.png').default} alt= {node.name}/>
            case 'txt':
                return <img src={require('./assets/texte' + id + '.png').default} alt= {node.name}/>
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
                {Format(format, highlighted)}
            </div>
        );
    }
}

export default CustomNode