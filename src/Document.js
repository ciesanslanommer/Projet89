import './Document.css';
import raw from 'raw.macro';
import {React, PureComponent} from 'react';
import ReactAudioPlayer from 'react-audio-player';
import leftArrow from './assets/arrowL.png'
import rightArrow from './assets/arrowR.png'
import doc_background from './assets/document_background.jpg';

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

function Video(props) {
    var path = props.parcours ? props.parcours + "/" : ""
    return (
        <video controls>
            <source src={require('./souvenirs/'+ path + props.path).default}
                    type="video/mp4">
            </source>
            Sorry, your browser doesn't support embedded videos.
        </video>
        /*<iframe 
            title={props.desc} 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/jXZAbnn1kTU" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
        </iframe>*/
    );
}


function DocumentButton(props) {
    var type = props.type;
    return (
        <div onClick={props.onClick} className={"button " + type}>
            {type === "previous" && <img className = "arrowbutton_img" alt="previous" src ={leftArrow}/>}
            <div className = "trail_img">
                {props.parcours.map( el => 
                    <img
                        key = {el}
                        src = {require("./assets/" + el.toLowerCase() +".png" ).default}
                        alt = {el}
                    />
                )}
            </div>
            {type === "next" && <img className = "arrowbutton_img" alt="next" src={rightArrow} />}
        </div>
    );
}

class Document extends PureComponent {
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
                return <Video key = {id} path = {path} parcours= {this.props.parcours} />
            default : 
                return <p key = {id}>{this.props.nature}</p>
        }
    }

    render() {
        let doc = this.displayDoc('main_doc', this.props.nature, this.props.path); // Main document
        let subs = this.props.subs; // Array of secondary documents associated with the main one
        // style={{ backgroundImage: "url(" + doc_background + ")" }}
        return(
            <div className="souvenir">
                <div id="memory_info">
                    <div id="date">
                        <p>25/05/20</p>
                    </div>
                    <div id="contributor">
                        <p>Abraham Lincoln</p>
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
                </div>
                <div className="buttons">
                    <div className="all_previous">
                        {this.state.sources.map(source =>
                            <DocumentButton 
                                key={source.id}
                                onClick={() => this.props.onNextClick(source.id)} 
                                type="previous" 
                                parcours= {source.parcours}
                            />
                        )}
                    </div>
                    <div className="all_next">
                        {this.state.targets.map(target =>
                            <DocumentButton 
                                key={target.id}
                                onClick={() => this.props.onNextClick(target.id)} 
                                type="next" 
                                parcours={target.parcours}
                            />
                        )}
                    </div>
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