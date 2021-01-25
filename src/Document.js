import './Document.css';
import raw from 'raw.macro';
import { React, PureComponent } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import leftArrow from './assets/arrowL.png';
import rightArrow from './assets/arrowR.png';

import { ENDPOINT_API } from './constants/endpoints';

const Image = (props) => {
  // var path = props.parcours ? props.parcours[0] + '/' : '';
  return (
    <img
      src={require('./souvenirs/' + props.path).default}
      alt={props.desc}
    ></img>
  );
};

function Text(props) {
  const path = props.path;
  // const dir = props.parcours ? props.parcours[0] : null;
  // if (dir) {
  //   return <p>{raw(`./souvenirs/${dir}/${path}`)}</p>;
  // } else {
  return <p>{raw(`./souvenirs/${path}`)}</p>;
  // }
}

function Audio(props) {
  // var path = props.parcours ? props.parcours[0] + '/' : '';
  return (
    <ReactAudioPlayer
      src={require('./souvenirs/' + props.path).default}
      autoPlay
      controls
    />
  );
}

function Video(props) {
  // var path = props.parcours ? props.parcours + '/' : '';
  return (
    <video controls>
      <source
        src={require('./souvenirs/' + props.path).default}
        type='video/mp4'
      ></source>
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
    <div onClick={props.onClick} className={'button ' + type}>
      {type === 'previous' ? (
        <img alt='previous' src={leftArrow} />
      ) : (
        <img alt='previous' src={rightArrow} />
      )}
    </div>
  );
}

class Document extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
      targets: [],
      memory: {},
      trails: this.getTrailById(this.props.trailByMemory),
      subs: [],
      loadedSubs: false,
      loadedMemory: false,
      loadedLinks: false,
    };
  }

  getTrailById(trailbymemory) {
    let trail = [];
    if (trailbymemory[this.props.id]) {
      trailbymemory[this.props.id].forEach((el) => {
        trail.push(el.name);
      });
    }
    return trail;
  }

  componentDidMount() {
    // TODO display a loader when not loaded yet?
    console.log(
      `Fetching souvenirs from ${ENDPOINT_API}/linkfrommemory/${this.props.id}`
    );
    fetch(ENDPOINT_API + '/linkfrommemory/' + this.props.id)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(`Success! link from memory ${this.props.id} = `, result);
          this.setState({
            sources: result.source,
            targets: result.target,
            loadedLinks: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading node',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

    console.log(
      `Fetching souvenirs from ${ENDPOINT_API}/memory/${this.props.id}`
    );
    fetch(ENDPOINT_API + '/memory/' + this.props.id)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(`Success! memory ${this.props.id} = `, result);
          this.setState({
            memory: { ...result },
            loadedMemory: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading node',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

    console.log(
      `Fetching souvenirs from ${ENDPOINT_API}/submemoryfrommemory/${this.props.id}`
    );
    fetch(ENDPOINT_API + '/submemoryfrommemory/' + this.props.id)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(`Success! memory ${this.props.id} = `, result);
          this.setState({
            subs: result,
            loadedSubs: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading node',
            error
          );
          // TODO maybe display an error for the user?
        }
      );
  }

  displayDoc(id, nature, path) {
    switch (nature) {
      case 'image':
        return <Image key={id} path={path} parcours={this.state.trails} />;
      case 'texte':
        return <Text key={id} path={path} parcours={this.state.trails} />;
      case 'audio':
        return <Audio key={id} path={path} parcours={this.state.trails} />;
      case 'video':
        return <Video key={id} path={path} parcours={this.state.trails} />;
      default:
        return <p key={id}>{this.state.memory.format}</p>;
    }
  }

  render() {
    //display doc to adapt with new data
    let doc = this.displayDoc(
      'main_doc',
      'image',
      '2019_5 juin 14h34_distribution alimentaire_roumanie.jpg'
    ); // Main document
    let subs = this.props.subs; // Array of secondary documents associated with the main one
    const loaded =
      this.state.loadedMemory &&
      this.state.loadedLinks &&
      this.state.loadedSubs;
    console.log(this.state.memory);
    return (
      <div className='souvenir'>
        {loaded && (
          <div>
            <div className='buttons'>
              {this.state.sources.map((source) => (
                <DocumentButton
                  key={source}
                  id={source}
                  onClick={() => this.props.onNextClick(source)}
                  type='previous'
                />
              ))}
            </div>
            <div className='document'>
              <h1>{this.state.memory.name}</h1>
              <p>{this.state.memory.description}</p>
              {doc}
              <p>{this.state.memory.texte}</p>
              <p>{this.state.memory.youtube}</p>
              {subs != null && (
                <div className='sub_docs'>
                  {subs.map((sub) =>
                    this.displayDoc(sub.id, sub.nature, sub.path)
                  )}
                </div>
              )}
            </div>
            <div className='buttons'>
              {this.state.targets.map((target) => (
                <DocumentButton
                  key={target}
                  id={target}
                  onClick={() => this.props.onNextClick(target)}
                  type='next'
                />
              ))}
            </div>
          </div>
        )}
        <img
          id='cross'
          src={require('./assets/close.png').default}
          alt='cross'
          onClick={this.props.onCrossClick}
        ></img>
      </div>
    );
  }
}

export default Document;
