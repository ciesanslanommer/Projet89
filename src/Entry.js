import {React, Component} from 'react'
import './Entry.css'

class Entry extends Component{
    render(){
        return(
            <div className="iconstrails">
                {/* <img src={require('./assets/' + this.props.path).default} alt="icontrails"></img> */}
                <object type="image/svg+xml" data={require('./assets/' + this.props.path).default}></object>
                <h2>{this.props.name}</h2>
            </div>
        )
    }
}



export default Entry;