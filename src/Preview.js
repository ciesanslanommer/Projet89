import './Preview.css'
import {React, Component} from 'react';

class Preview extends Component {

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.pos != this.props.pos) {
            this.setPosition();
        }
    }

    setPosition() {
        document.querySelector('.resume').style.left = `${this.props.pos.x}px`;
        document.querySelector('.resume').style.top = `${this.props.pos.y}px`;
        console.log(document.querySelector('.resume').style.left);
    }
    
    render() {
        return (
                <div className = 'resume'>
                    <p>Preview</p>
                </div>
        )
    }
}

export default Preview;