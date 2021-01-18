function CustomNode({node, zoom}){
    let highlighted = node.highlighted
    let nature = node.nature
    let visited = node.visited
    let visible = zoom > node.zoom ? true : false
    let style = {maxHeight : "100%", maxWidth : "100%"}
    function Format(nature, highlighted) {
        let id = highlighted ? 2 : 1
        switch (nature) {
            case 'image':
                return <img style={style} src={require('./assets/photo' + id + '.png').default} alt={node.name} />
            case 'texte':
                return <img style={style} src={require('./assets/texte' + id + '.png').default} alt={node.name} />
            case 'audio':
                return <img style={style} src={require('./assets/audio' + id + '.png').default} alt={node.name} />
            case 'video':
                return <img style={style} src={require('./assets/video' + id + '.png').default} alt={node.name} />
            default:
                return <img style={style} src={require('./assets/texte' + id + '.png').default} alt={node.name} />
        }
    }
    if(!visible)
        return <div></div>
    if(visited){
        style= {backgroundColor : 'red', borderRadius : "50%", padding: "30%", margin:"20%" }
        return(
            <div style = {style}></div>
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