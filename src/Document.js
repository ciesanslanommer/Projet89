import './Document.css';
import raw from 'raw.macro';
import {React, Component} from 'react';

const Image = (props) => (
    <img
        src={require('./../public/souvenirs/' + props.path).default}
        alt={props.desc}
    >
    </img>
)

function Text(props) {
    const path = props.path;
    return (
        <p>{raw(`../public/souvenirs/${path}`).substr(0,500).concat("...")}</p>
    );
}

// const Audio = (props) => {

// }

class Document extends Component {

    handleClick = e => {
        this.props.onClick();
    }

    handleType() {
        switch(this.props.nature) {
            case 'image':
                return <Image path = {this.props.path} desc = {this.props.desc}/>;
            case 'texte':
                return <Text path = {this.props.path} desc = {this.props.desc}/>
            case 'audio':
                return <p>AUDIO</p>
            case 'video':
                return <p>VIDEO</p>
            default : 
                return <p>{this.props.nature}</p>
        }
    }

    render() {
        let doc = this.handleType();
        return(
            <div className="souvenir">
                <h1>{this.props.desc}</h1>
                {doc}
                <img 
                    id='cross' 
                    src={require('./assets/close.png').default}
                    alt='cross'
                    onClick={this.handleClick}
                >
                </img> 
            </div>
        );
    }
}

export default Document;