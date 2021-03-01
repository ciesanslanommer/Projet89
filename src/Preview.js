import './Preview.css'
import {React, PureComponent} from 'react';
import doc_background from './assets/document_background.jpg';

class Preview extends PureComponent {
    
    render() {
        const title = this.props.name;
        const x = this.props.pos.x - 5; /* + 5 Else issue bcse mouse continuously mouse over and out */
        const y = this.props.pos.y - 5;  /* + 5 Else issue bcse mouse continuously mouse over and out */
        const translateX = this.props.sizeNode + this.props.sizeNode*0.2;
        const translateY = 0;

        return (
                <div className = 'resume' style={{top: y + 'px', left: x + 'px', transform: `translate(${translateX}px, ${translateY}px)`, backgroundImage: "url(" + doc_background + ")" }}>
                    <h2>{title}</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat, metus in facilisis iaculis,magna orci eleifend augue.</p>
                </div>
        )
    }
}

export default Preview;