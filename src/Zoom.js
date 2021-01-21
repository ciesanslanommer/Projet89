import React, {Component} from "react";
import './Zoom.css';

class Zoom extends Component{

    state = {
        positionY: 30
    };

    getZoomValue() {
        var zoomValue = document.getElementById("myRange").value;
        console.log("valeur de cursorZoom : " + zoomValue);
    }

    render(){
        return (
            <div id="slideContainer">
                <input className="slider" id="myRange" type="range" min="0" max="6" onMouseUp={this.getZoomValue}></input>
            </div>
        )
    };
}






export default Zoom;