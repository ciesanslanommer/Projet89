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
    constructor(props){
        super(props)
        this.state = ({
            sources: this.props.links.sources,
            targets: this.props.links.targets,
        })
    }

    displayDoc(id, nature, path) {
        switch(nature) {
            case 'image':
                return <Image key = {id} path = {path} parcours= {this.props.parcours }/>
            case 'texte':
                return <Text key = {id} path = {path} parcours= {this.props.parcours} />
            case 'audio':
                return <Audio key = {id} path = {path} parcours= {this.props.parcours} />
            case 'video':
                return <p key = {id}>VIDEO</p>
            default : 
                return <p key = {id}>{this.props.nature}</p>
        }
    }

    render() {
        let doc = this.displayDoc('main_doc', this.props.nature, this.props.path); // Main document
        let subs = this.props.subs; // Array of secondary documents associated with the main one
        return(
            <div className="souvenir">
                <div className="sources">
                    {this.state.sources.map(id=>
                        <button onClick={() => this.props.onNextClick(id)}>Previous</button>
                    )}
                </div>
                <h1>{this.props.desc}</h1>
                {doc}
                <div className="sub_docs">
                    { subs!=null && subs.map( (sub) => this.displayDoc(sub.id, sub.nature, sub.path) )}
                </div>
                <div className="targets">
                    {this.state.targets.map(id =>
                        <button onClick={() => this.props.onNextClick(id)}>Next</button>
                    )}
                </div>
                <img 
                    id='cross' 
                    src={require('./assets/close.png').default}
                    alt='cross'
                    onClick={this.props.onCrossClick}
                >
                </img> 
            </div>
        );
    }
}

export default Document;