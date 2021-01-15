import './Document.css';
import raw from 'raw.macro';
import {React, Component} from 'react';
import ReactAudioPlayer from 'react-audio-player';

const Image = (props) => {
    var path = props.parcours ? props.parcours + "/" : ""
    return (<img
        src={require('./souvenirs/'  + path + props.path).default}
        alt={props.desc}
    ></img>)
}

function Text(props) {
    const path = props.path;
    const dir = props.parcours;
    if (dir){
        return (
            <p>{raw(`./souvenirs/${dir}/${path}`)}</p>
        );
    } else {
        return (
            <p>{raw(`./souvenirs/${path}`)}</p>
        );
    }
    
}

function Audio(props) {
    var path = props.parcours ? props.parcours + "/" : ""
    return (
        <ReactAudioPlayer
            src={require('./souvenirs/'+ path + props.path).default}
            autoPlay
            controls
        />
    );
}

class Document extends Component {

    handleClick = e => {
        this.props.onClick();
    }

    handleType() {
        switch(this.props.nature) {
            case 'image':
                return <Image path = {this.props.path} parcours= {this.props.parcours}/>
            case 'texte':
                return <Text path = {this.props.path} parcours= {this.props.parcours} />
            case 'audio':
                return <Audio path = {this.props.path} parcours= {this.props.parcours}/>
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