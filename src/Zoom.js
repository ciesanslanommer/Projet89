import React, {Component} from "react";
import './Zoom.css';

class Zoom extends Component{

    getZoomValue = (event) => {
        var zoomValue = document.getElementById("myRange").value;
        console.log("valeur de cursorZoom : " + zoomValue);
        return zoomValue;
    }

    render(){
        return (
            <div id="slideContainer">
                <input className="slider" id="myRange" type="range" min="0" max="3" step="0.1" onMouseUp={() => this.props.data.zoomCursorValue(this.getZoomValue)}></input>
            </div>
        )
    };
}






export default Zoom;