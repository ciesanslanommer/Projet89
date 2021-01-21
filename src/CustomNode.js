import {React, Component} from 'react';
import Preview from './Preview.js'
import './CustomNode.css'

class CustomNode extends Component{
    render () {
        var classNames = require('classnames');
        const highlighted = this.props.highlighted
        const visited = this.props.visited
        const visible = this.props.zoom > this.props.nodeZoom ? true : false
        if(!visible) return <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited, 'visited': visited})}></div>
        
        return(
            <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited, 'visited': visited, 'highlighted': highlighted})}>
                {/* {highlighted ? <Preview resume = {this.props.name} /> : ""} */}
                {visited?  "" : <img className="icons" src={require('./assets/work.svg').default} alt="icon"></img>}
               
               

             </div>
         );
    };
}

export default CustomNode;