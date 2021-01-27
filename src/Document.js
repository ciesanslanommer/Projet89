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
      src={props.path}
      alt={props.desc}
    ></img>
  );
};

function Text(props) {
  return <p>{props.content}</p>;
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
      <div className='trails_img'>
        {/* {props.parcours.map((el) => (
          <img
            key={el}
            src={require('./assets/' + el.toLowerCase() + '_brown.svg').default}
            alt={el}
          />
        ))} */}
        <div className='trail_img'>
            <img src={require('./assets/trails/ruines.png').default} alt=""/>
            <p>Ruines</p>
        </div>
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

  displayDoc(id, nature, content, desc) {
    switch (nature) {
      case 'image':
        return <Image key={id} path={content} desc={desc} />;
      case 'texte':
        return <Text key={id} content={content} />;
      case 'audio':
        return <Audio key={id} path={content} />;
      case 'video':
        return <Video key={id} path={content} />;
      default:
        return <p key={id}>{this.state.memory.format}</p>;
    }
  }

  render() {
      let doc = this.displayDoc('main_doc', this.state.memory.format, this.state.memory.content, this.state.memory.description); // Main document
      let subs = this.props.subs; // Array of secondary documents associated with the main one
      
      return (
          <div className='souvenir'>
              <div id='trail_info'>
                <h1>{this.state.trails[0]}</h1>
              </div>

            <div id='memory_and_navigation'>

                <div className='all_previous'>
                    {this.state.sources.map((source) => (
                        <DocumentButton
                            key={source}
                            onClick={() => this.props.onNextClick(source)}
                            type='previous'
                        // parcours={source.parcours}
                        />
                    ))}
                </div>

                <div id='memory_info'>
                    <div id='date'>
                        <p>{this.state.memory.contribution_date && this.state.memory.contribution_date.split('T')[0]}</p>
                    </div>
                    <div id='contributor'>
                        <p>{this.state.memory.contributeur}</p>
                    </div>
                    <div className='document'>
                        <h1>{this.props.name}</h1>
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

                <div className='all_next'>
                    {this.state.targets.map((target) => (
                        <DocumentButton
                            key={target}
                            onClick={() => this.props.onNextClick(target)}
                            type='next'
                        // parcours={target.parcours}
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

      </div>
    );
  }
}

export default Document;
