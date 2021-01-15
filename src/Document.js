import './Document.css';
// import raw from 'raw.macro';
import {React, Component} from 'react';
import ReactAudioPlayer from 'react-audio-player';

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
        // <p>{raw(`../public/souvenirs/${path}`).substr(0,500).concat("...")}</p>
        <p>TEXT</p>
    );
}

function Audio(props) {
    return (
        <ReactAudioPlayer
            src={require('./../public/souvenirs/' + props.path).default}
            autoPlay
            controls
        />
    );
}

class Document extends Component {

    handleClick = e => {
        this.props.onClick();
    }

    displayDoc(nature, path) {
        switch(nature) {
            case 'image':
                return <Image path = {path}/>
            case 'texte':
                return <Text path = {path}/>
            case 'audio':
                return <Audio path = {path}/>
            case 'video':
                return <p>VIDEO</p>
            default : 
                return <p>{this.props.nature}</p>
        }
    }

    render() {
        let doc = this.displayDoc(this.props.nature, this.props.path);
        let sub_doc = this.props.sub != null ? this.displayDoc(this.props.sub.nature, this.props.sub.path) : null;
        let tab = [0 ,2];
        // console.log("TEST TEST TEST");
        // console.log(Array.isArray(this.props));
        // console.log(this.props);
        // console.log(Array.isArray(tab));
        // console.log(tab);
        return(
            <div className="souvenir">
                <h1>{this.props.desc}</h1>
                {doc}
                {sub_doc}
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