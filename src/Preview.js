import './Preview.css'
import {React, Component} from 'react';

class Preview extends Component {
    
    render() {
        let pos = 'nodeId : ' + this.props.nodeId + ' pos : ' + this.props.pos.x + ' / ' + this.props.pos.y;
        return (
                <div className = 'resume' style={{top: this.props.pos.y + 'px', left: this.props.pos.x}}>
                    <p>{pos}</p>
                </div>
        )
    }
}

export default Preview;