import React, {Component} from "react";
import './Zoom.css';

class Zoom extends Component{

    getZoomValue = () => {
        console.log(this.props.zoom);
        var zoomValue = document.getElementById("myRange").value;
        this.props.zoomCursorValue(zoomValue);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.zoom !== this.props.zoom){
            document.getElementById("myRange").value = this.props.zoom;
        }
    }

    render(){
        const zoomScrollValue = this.props.zoom
        return (
            <div id="sliderContainer">
                <input className="slider" id="myRange" defaultValue='0.2' type="range" min="0" max="3" step="0.1" onMouseUp={this.getZoomValue}></input>
            </div>
        )
    };
}






export default Zoom;