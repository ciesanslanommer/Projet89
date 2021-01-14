import './Document.css';
import raw from 'raw.macro';
import {React, Component} from 'react';
import { render } from '@testing-library/react';


// function Document({path, desc, format}){
//     const cross = data.nodes[0];

//     return(
//         <div className="souvenir">
//             <h1>{desc}</h1>
//             {(format === 'jpg' || format === 'png') ? 
//                 <img src={require('./../public/souvenirs/' + path + "." + format).default} alt={desc}></img> 
//                 : <p>{raw(`../public/souvenirs/${path}.txt`).substr(0,500).concat("...")}</p>
//             }
//             <img 
//                 id='cross' 
//                 src={require('./../public/assets/' + cross.path + '.' + cross.format).default} 
//                 alt={cross.name}
//                 onClick={ () => alert('clicked') }>
//             </img> 

//         </div>
//     );
// }

class Document extends Component {

    constructor(props) {
        super(props);
    }

    handleClick = e => {
        this.props.onClick();
    }

    render() {
        const path = this.props.path;
        return(
            <div className="souvenir">
                <h1>{this.props.desc}</h1>
                {(this.props.format === 'jpg' || this.props.format === 'png') ? 
                    <img src={require('./../public/souvenirs/' + this.props.path + "." + this.props.format).default} alt={this.props.desc}></img> 
                    : <p>{raw(`../public/souvenirs/${path}.txt`).substr(0,500).concat("...")}</p>
                }
                <img 
                    id='cross' 
                    src={require('./assets/cross.png').default}
                    alt='cross'
                    onClick={this.handleClick}
                >
                </img> 
            </div>
        );
    }
}



export default Document;