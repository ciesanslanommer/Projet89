import React, {Component} from "react";
import './Zoom.css';

class Zoom extends Component{

    getZoomValue = () => {
        console.log(this.props.zoom);
        var zoomValue = document.getElementById("myRange").value;
        return zoomValue;
    }

    componentDidMount(){
       document.getElementById("myRange").value = 0.2; //au lancement de la page, place le curseur
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.zoom !== this.props.zoom){
            document.getElementById("myRange").value = this.props.zoom;
            
            // console.log(prevProps.zoom);
        }
        
    }

    render(){
        
        return (
            <div id="sliderContainer">
                <input className="slider" id="myRange" type="range" min="0" max="3" step="0.1" onMouseUp={() => this.props.data.zoomCursorValue(this.getZoomValue)}></input>
            </div>
        )
    };
}






export default Zoom;