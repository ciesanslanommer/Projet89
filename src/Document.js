import './Document.css';
import raw from 'raw.macro';
import {React, Component} from 'react';
import ReactAudioPlayer from 'react-audio-player';
import leftArrow from './assets/arrowL.png'
import rightArrow from './assets/arrowR.png'

const Image = (props) => {
    var path = props.parcours ? props.parcours[0] + "/" : ""
    return (<img
        src={require('./souvenirs/'  + path + props.path).default}
        alt={props.desc}
    ></img>)
}

function Text(props) {
    const path = props.path;
    const dir = props.parcours? props.parcours[0] : null;
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
    var path = props.parcours ? props.parcours[0] + "/" : ""
    return (
        <ReactAudioPlayer
            src={require('./souvenirs/'+ path + props.path).default}
            autoPlay
            controls
        />
    );
}


function DocumentButton(props) {
    var type = props.type;
    return (
        <div onClick={props.onClick} className={"button " + type}>
            {type === "previous" && <img alt="previous" src ={leftArrow}/>}
            {props.parcours.map( el => 
                <img
                    key = {el}
                    src = {require("./assets/" + el.toLowerCase() +".png" ).default}
                    alt = {el}
                />
            )}
            {type === "next" && <img alt="previous" src={rightArrow} />}
        </div>
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
                <div className="buttons">
                    {this.state.sources.map(source =>
                        <DocumentButton 
                            key={source.id}
                            onClick={() => this.props.onNextClick(source.id)} 
                            type="previous" 
                            parcours= {source.parcours}
                        />
                    )}
                </div>
                <div className="document">
                    <h1>{this.props.desc}</h1>
                    {doc}
                {subs!=null && 
                    <div className="sub_docs"> 
                        {subs.map( (sub) => this.displayDoc(sub.id, sub.nature, sub.path) )}
                    </div>
                }
                </div>
                <div className="buttons">
                {this.state.targets.map(target =>
                    <DocumentButton 
                        key={target.id}
                        onClick={() => this.props.onNextClick(target.id)} 
                        type="next" 
                        parcours={target.parcours}
                    />
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