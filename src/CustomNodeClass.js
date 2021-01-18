import {React, Component} from 'react';
import Resume from './Resume.js'
import './CustomNode.css'

class CustomNodeClass extends Component{
    render () {
        let name = this.props.name
        let nature = this.props.nature
        let highlighted = this.props.highlighted
        let visited = this.props.visited
        let visible = this.props.zoom > this.props.nodeZoom ? true : false
        let style = {maxHeight : "100%", maxWidth : "100%"}

        const Format = (nature, highlighted) => {
            let id = highlighted ? 2 : 1
            switch (nature) 
        {
            case 'image':
                if(highlighted){
                    return (
                        <div>
                            <img style = {style} src={require('./assets/photo' + id + '.png').default} alt= {name}/>
                            <Resume resume = {this.props} />
                        </div>
                    )
                }
                else
                {
                    return (
                        <div>
                            <img style = {style} src={require('./assets/photo' + id + '.png').default} alt= {name}/>
                        </div>
                    )
                }
            case 'texte':
                if(highlighted){
                    return (
                        <div>
                            <img style = {style} src={require('./assets/texte' + id + '.png').default} alt= {name}/>
                            <Resume resume = {this.props} />
                        </div>
                    )
                }
                else
                {
                    return (
                        <div>
                            <img style = {style} src={require('./assets/texte' + id + '.png').default} alt= {name}/>
                        </div>
                    )
                }
            case 'audio':
                if(highlighted){
                    return (
                        <div>
                            <img style = {style} src={require('./assets/audio' + id + '.png').default} alt= {name}/>
                            <Resume resume = {this.props} />
                        </div>
                    )
                } 
                else
                {
                    return (
                        <div>
                            <img style = {style} src={require('./assets/audio' + id + '.png').default} alt= {name}/>
                        </div>
                    )  
                }
                
            default :
            if(highlighted){
                return (
                    <div>
                        <img style = {style} src={require('./assets/texte' + id + '.png').default} alt= {name}/>
                        <Resume resume = {this.props} />
                    </div>
                )
            }
            else
            {
                return (
                    <div>
                        <img style = {style} src={require('./assets/texte' + id + '.png').default} alt= {name}/>
                    </div>
                )
            }
         }
        }

        let visibleClass = visible ? "appear" : "disappear"
        if(visited){
            style= {backgroundColor : 'red', borderRadius : "50%", padding: "30%", margin:"20%" }
            return(
                <div class={visibleClass} style = {style}></div>
            )
        }
        else{
            return(
                <div class = {visibleClass}>
                    {Format(nature, highlighted)}
                    
                </div>
            );
        }
    };
}

export default CustomNodeClass;