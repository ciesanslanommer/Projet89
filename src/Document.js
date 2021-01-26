import './Document.css';
import raw from 'raw.macro';
import { React, PureComponent } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Arrow from './assets/arrow.png';
// import doc_background from './assets/document_background.jpg';
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
      {type === 'previous' && (
        <img className='arrowbutton_img' alt='previous' src={Arrow} />
      )}
      <div className='trail_img'>
        {props.parcours.map((el) => (
          <img
            key={el}
            src={require('./assets/' + el.toLowerCase() + '_brown.svg').default}
            alt={el}
          />
        ))}
      </div>
      {type === 'next' && (
        <img className='arrowbutton_img' alt='next' src={Arrow} />
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
    console.log('les parcours du doc');
    console.log(trail);
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

    // console.log(
    //   `Fetching souvenirs from ${ENDPOINT_API}/submemoryfrommemory/${this.props.id}`
    // );
    // fetch(ENDPOINT_API + '/submemoryfrommemory/' + this.props.id)
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       console.log(`Success! submemory ${this.props.id} = `, result);
    //       this.setState({
    //         subs: result,
    //         loadedSubs: true,
    //       });
    //     },
    //     (error) => {
    //       console.error(
    //         'Oops, something wrong happened when loading node',
    //         error
    //       );
    //       // TODO maybe display an error for the user?
    //     }
    //   );
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
    let doc = this.displayDoc('main_doc', this.props.nature, this.props.path); // Main document
    let subs = this.props.subs; // Array of secondary documents associated with the main one
    return (
      <div className='souvenir'>
        <div id='memory_info'>
          <div id='date'>
            <p>25/05/20</p>
          </div>
          <div id='contributor'>
            <p>Abraham Lincoln</p>
          </div>
          <div className='document'>
            <h1>{this.props.desc}</h1>
            {doc}
            {subs != null && (
              <div className='sub_docs'>
                {subs.map((sub) =>
                  this.displayDoc(sub.id, sub.nature, sub.path)
                )}
              </div>
            )}
          </div>
        </div>
        <div className='buttons'>
          <div className='all_previous'>
            {this.state.sources.map((source) => (
              <DocumentButton
                key={source.id}
                onClick={() => this.props.onNextClick(source.id)}
                type='previous'
                parcours={source.parcours}
              />
            ))}
          </div>
          <div className='all_next'>
            {this.state.targets.map((target) => (
              <DocumentButton
                key={target.id}
                onClick={() => this.props.onNextClick(target.id)}
                type='next'
                parcours={target.parcours}
              />
            ))}
          </div>
        </div>
        <img
          id='cross'
          src={require('./assets/close_brown.png').default}
          alt='cross'
          onClick={this.props.onCrossClick}
        ></img>
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
    );
  }
}

export default Document;
