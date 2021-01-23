import {React, Component} from 'react'
import './CustomNode.css'

class CustomNode extends Component{

    render () {
        var classNames = require('classnames');
        const highlighted = this.props.highlighted
        const visited = this.props.visited
        const visible = this.props.zoom > this.props.nodeZoom ? true : false
        //console.log("this.props.zoom : " + this.props.zoom)
        //console.log("this.props.nodeZoom : " + this.props.nodeZoom)
        //console.log("visible : " + visible)

        if(!visible) return <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited, 'invisibleVisited': !visible && visited})}></div>
        
        return(
            <div className = {classNames({'visible': visible, 'invisible' : !visible && !visited,'invisibleVisited': !visible && visited, 'highlighted': highlighted})}>
                {/* {highlighted ? <Preview resume = {this.props.name} /> : ""} */}
                {visited?  <img className="icons" src={require('./assets/work_visited.svg').default} alt="icon"></img> : <img className="icons" src={require('./assets/work.svg').default} alt="icon"></img>}
            </div>
         );
    };
}

export default CustomNode;