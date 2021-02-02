import './Preview.css'
import {React, PureComponent} from 'react';

class Preview extends PureComponent {
    
    render() {
        const x = this.props.pos.x;
        const y = this.props.pos.y; 
        const translateX = this.props.size;
        const translateY = 0;
        console.log(this.props.desc);
        return (
                <div className = 'resume' style={{top: y + 'px', left: x + 'px', transform: `translate(${translateX}px, ${translateY}px)`}}>
                    <h2>{this.props.name}</h2>
                    {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat, metus in facilisis iaculis,magna orci eleifend augue.</p> */}
                    <p>{this.props.desc}</p>
                </div>
                // <div style = {{ position:'absolute', opacity:'0.2', top:y+'px', left:x+'px', width:size+'px', height:size+'px', background: 'red', transform: `translate(${translateX}px, ${translateY}px)` }}></div>
        )
    }
}

export default Preview;