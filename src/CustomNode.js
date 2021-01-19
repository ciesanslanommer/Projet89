import {React, Component} from 'react';
import Preview from './Preview.js'
import './CustomNode.css'

class CustomNode extends Component{
    render () {
        var classNames = require('classnames');
        const name = this.props.name
        const nature = this.props.nature
        const highlighted = this.props.highlighted
        const visited = this.props.visited
        const visible = this.props.zoom > this.props.nodeZoom ? true : false
        let style = {maxHeight : "100%", maxWidth : "100%"}
        
        if(!visible) return <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited, 'visited': visited})}></div>
        return(
            <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited, 'visited': visited, 'highlighted': highlighted})}>
                {highlighted ? <Preview resume = {this.props}/> : ""}
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