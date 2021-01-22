import './Preview.css'
import {React, Component} from 'react';

class Preview extends Component {
    
    render() {
        const title = this.props.node.name;
        const x = this.props.pos.x + 5; /* + 5 Else issue bcse mouse continusly mouse over and out */
        const y = this.props.pos.y + 5;  /* + 5 Else issue bcse mouse continusly mouse over and out */
        return (
                <div className = 'resume' style={{top: y + 'px', left: x + 'px'}}>
                    <h2>{title}</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat, metus in facilisis iaculis,magna orci eleifend augue.</p>
                </div>
        )
    }
}

export default Preview;