import './Document.css';
// import raw from 'raw.macro';
import { React, PureComponent, Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Arrow from './assets/arrow.png';
// import doc_background from './assets/document_background.jpg';
import { ENDPOINT_API } from './constants/endpoints';


const Image = (props) => {
  return <img src={props.path} alt={props.desc}></img>;
};

function Text(props) {
  return <p>{props.content}</p>;
}

function Audio(props) {
  return (
    <ReactAudioPlayer
      src={require('./souvenirs/' + props.path).default}
      autoPlay
      controls
    />
  );
}

function Video(props) {
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

class DocumentButton extends Component {

  highlightDirectionOfButton(currentId, nodeId) {
    console.log('inside function ' + currentId + ' ' + nodeId);
    const htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    const htmlLink = this.props.type === 'previous' ? 
      document.querySelector(`[id="${nodeId},${currentId}"]`) :
      document.querySelector(`[id="${currentId},${nodeId}"]`);
    
    htmlNode.classList.remove('inParcours');
    htmlLink.classList.remove('inParcours');
    htmlNode.classList.add('relatedtoButton');
    htmlLink.classList.add('relatedtoButton');
  }

  removeHighlightDirectionOfButton(currentId, nodeId) {
    console.log('remove');
    const htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    const htmlLink = this.props.type === 'previous' ? 
      document.querySelector(`[id="${nodeId},${currentId}"]`) :
      document.querySelector(`[id="${currentId},${nodeId}"]`);
    
    htmlNode.classList.add('inParcours');
    htmlLink.classList.add('inParcours');
    htmlNode.classList.remove('relatedtoButton');
    htmlLink.classList.remove('relatedtoButton');
  }

  render() {
    let props = this.props;
    var type = props.type;
    return (
      <div onClick={props.onClick} className={'button ' + type}>
        {type === 'previous' && (
          <img className='arrowbutton_img' alt='previous' src={Arrow} 
            onMouseOver={ () => this.highlightDirectionOfButton(this.props.currentId, this.props.id)}
            onMouseOut={ () => this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id)}
          />
        )}
        <div className='trails_img'>
          {props.parcours.map((el) => (
            <div className='trail_img' key={`div ${type} ${el.parcours}`}>
              <img
                key={`img ${type} ${el.parcours}`}
                id={`img ${type} ${el.parcours}`}
                src={require('./assets/' + el.path).default}
                alt={el.parcours}
              />
              <h2 key={`name ${type} ${el.parcours}`}>{el.parcours}</h2>
            </div>
          ))}
        </div>
  
        {type === 'next' && (
          <img className='arrowbutton_img' alt='next' src={Arrow} 
          onMouseOver={ () => this.highlightDirectionOfButton(this.props.currentId, this.props.id)}
          onMouseOut={ () => this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id)}
          />
        )}
      </div>
    );

  };


}; 

class Document extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sources: [],
      targets: [],
      memory: {},
      trails: this.getTrailById(this.props.id),
      subs: [],
      loadedSubs: false,
      loadedMemory: false,
      loadedLinks: false,
    };
  }

  getTrailById = (id) => {
    let trail = [];
    if (this.props.trailByMemory[id]) {
      console.log(this.props.trailByMemory[id]);
      this.props.trailByMemory[id].forEach((el) => {
        const obj = { parcours: el.name, path: el.path };
        trail.push(obj);
      });
    }
    // console.log('les parcours du doc');
    console.log(trail);
    return trail;
  };

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

          result.source = result.source.map((id) => {
            const trail = this.getTrailById(id);
            // console.log(id);
            // console.log(trail);
            return {
              id: id,
              parcours: trail,
            };
          });

          result.target = result.target.map((id) => {
            const trail = this.getTrailById(id);
            // console.log(trail);
            return {
              id: id,
              parcours: trail,
            };
          });

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
        return (
          <Image
            key={id}
            path={content}
            desc={desc}
            parcours={this.state.trails}
          />
        );
      case 'texte':
        return <Text key={id} content={content} parcours={this.state.trails} />;
      case 'audio':
        return <Audio key={id} path={content} parcours={this.state.trails} />;
      case 'video':
        return <Video key={id} path={content} parcours={this.state.trails} />;
      default:
        return <p key={id}>{this.state.memory.format}</p>;
    }
  }

  render() {
    let doc = this.displayDoc(
      'main_doc',
      this.state.memory.format,
      this.state.memory.content,
      this.state.memory.description
    ); // Main document
    let subs = this.props.subs; // Array of secondary documents associated with the main one
    let trail = 'PARCOURS';
    for (let i = 0; i < this.state.trails.length; i++) {
      trail += ' ' + this.state.trails[i].parcours.toUpperCase();
    }

    return (
      <div className='souvenir'>
        {trail !== 'PARCOURS' && <div id='trail_info'>
          <h1>{trail}</h1>
        </div>}

        <div id='memory_and_navigation'>
          <div className='all_previous'>
            {this.state.sources.map((source) => (
              <DocumentButton
                key={source.id}
                id={source.id}
                onClick={() => this.props.onNextClick(source.id)}
                type='previous'
                parcours={source.parcours}
                id={source.id}
                currentId={this.props.id}
              />
            ))}
          </div>

          <div id='memory_info'>
            <div id='date'>
              <p>
                {this.state.memory.contribution_date &&
                  this.state.memory.contribution_date
                    .split('T')[0]
                    .split('-')
                    .reverse()
                    .join('/')}
              </p>
            </div>
            <div id='contributor'>
              <p>{this.state.memory.contributeur}</p>
            </div>
            <div className='document'>
              <h1>{this.state.memory.name}</h1>
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
                id={target.id}
                key={target.id}
                onClick={() => this.props.onNextClick(target.id)}
                type='next'
                parcours={target.parcours}
                id={target.id}
                currentId={this.props.id}
              />
            ))}
          </div>
        </div>

        {trail !== 'PARCOURS' ? 
        <img
          className='cross'
          src={require('./assets/close.png').default}
          alt='cross'
          onClick={this.props.onCrossClick}
        /> :
        <img
          className='cross'
          src={require('./assets/close.png').default}
          alt='cross'
          onClick={this.props.onCrossClick}
          style={{filter: "grayscale(1) brightness(0)"}}
        />
        }
      </div>
    );
  }
}

export default Document;
