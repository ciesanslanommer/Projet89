import {React, Component} from 'react';
import Preview from './Preview.js'
import './CustomNode.css'

class CustomNode extends Component{
    render () {
        console.log(this.props.size)
        var classNames = require('classnames');
        let name = this.props.name
        let nature = this.props.nature
        let highlighted = this.props.highlighted
        let visited = this.props.visited
        const visible = this.props.zoom > this.props.nodeZoom ? true : false
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
                            <Preview resume = {this.props} />
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
                            <Preview resume = {this.props} />
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
                            <Preview resume = {this.props} />
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
                        <Preview resume = {this.props} />
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
        
        if(!visible) return <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited, "visited": visited})}></div>
        return(
            <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited, "visited": visited})}>
                 {visited ? "" : Format(nature, highlighted)}            
             </div>
         );
  
        // return(
        //     <div className = {classNames({'visible': visible === true, 'invisible': visible === false, "visite": visited === true})}>
        //         { visited? "" : Format(nature, highlighted)}
        //     </div>
        // );
    };
}

export default CustomNode;