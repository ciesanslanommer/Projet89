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