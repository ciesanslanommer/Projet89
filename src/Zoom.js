import React, {PureComponent} from "react";
import './Zoom.css';

class Zoom extends PureComponent {
    render(){
        return (
            <div id="sliderContainer">
                <input
                    className="slider"
                    id="myRange"
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={this.props.zoom}
                    onChange={this.props.onChange}
                    onMouseUp={this.props.onMouseUp}
                    onMouseDown={this.props.onMouseDown}
                />
            </div>
        )
    };
}
export default Zoom;
