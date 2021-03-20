import './Document.css';
import './DocumentButton.css';
// import raw from 'raw.macro';
import React, { PureComponent, Component, useEffect } from 'react';
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';
import Arrow from './assets/arrow.png';
// import doc_background from './assets/document_background.jpg';
import { ENDPOINT_API } from './constants/endpoints';
const classNames = require('classnames');

const Image = (props) => {
  return <img src={props.path} alt={props.desc}></img>;
}

function Text(props) {

  useEffect(() => {
    const highlightedText = document.querySelector('span.highlightedText');
    if (highlightedText) {
      highlightedText.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (!props.content) {
    return <p>Souvenir non trouvé</p>;
  }

  const content = props.content.replace(/{{/g, '<span class="highlightedText">').replace(/}}/g, '</span>');
  return <p dangerouslySetInnerHTML={{ __html: content }} />
}


function Audio(props) {
  return (
    <ReactAudioPlayer
      src={props.path}
      autoPlay
      controls
    />
  );
}

function Video(props) {
  return (
    <ReactPlayer
      url={props.path}
      playing
      controls
    />
  );
}

function DocHeader(props) {
  return (
    <div id='trail_info'>
      <h1>{props.trail}</h1>
    </div>
  )
}

class DocumentButton extends Component {

  constructor(props) {
    super(props);
  }

  highlightDirectionOfButton(currentId, nodeId) {

    const htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    const htmlLink = this.props.type === 'previous' ? 
      document.querySelector(`[id="${nodeId},${currentId}"]`) :
      document.querySelector(`[id="${currentId},${nodeId}"]`);

    //htmlNode.classList.remove('inTrail');
    htmlLink.classList.remove('inTrail');
    //htmlNode.classList.add('relatedtoButton');
    htmlLink.classList.add('relatedtoButton');
  }

  removeHighlightDirectionOfButton(currentId, nodeId) {
    const htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    const htmlLink = this.props.type === 'previous' ? 
      document.querySelector(`[id="${nodeId},${currentId}"]`) :
      document.querySelector(`[id="${currentId},${nodeId}"]`);

    //htmlNode.classList.add('inTrail');
    htmlLink.classList.add('inTrail');
    //htmlNode.classList.remove('relatedtoButton');
    htmlLink.classList.remove('relatedtoButton');
  }

  onMouseOver = (e) => {
    this.highlightDirectionOfButton(this.props.currentId, this.props.id);
    const trail = this.props.parcours.length <= 1 ? this.props.parcours[0].parcours : this.props.currentTrail;
    this.props.changeTrailImg(trail);
  }

  onMouseOut = (e) => {
    this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id);
    this.props.changeTrailImg(this.props.currentTrail);
  }

  onClick = () => {
    this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id);
    this.props.onClick();
  }

  render() {
    let props = this.props;
    var type = props.type;
    //this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id);
    let current = false;
    for(let i=0; i<this.props.parcours.length; i++) {
      if(this.props.parcours[i].parcours === this.props.currentTrail) {
        current = true;
        break;
      }
    }

    return (
      <div onClick={this.onClick} className={classNames({
        [`button-current`]: current,
        [`button`]: !current,
        [`${type}`]: true
        })}
      >
        <img className='arrowbutton_img' alt={type} src={Arrow} 
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
        />
      </div>
    );

  };


} 

class CenterButton extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.resizeTrailImg();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.trailImg !== this.props.trailImg) {
      this.resizeTrailImg();
    }
  }

  resizeTrailImg() {
    const img = document.querySelector('#trail_img');
    const width_o = img.width;
    const height_o = img.height;

    if(width_o > height_o) {
      img.classList.remove('heightGreaterThanWidth');
      img.classList.add('widthGreaterThanHeight');
    }
    else {
      img.classList.add('heightGreaterThanWidth');
      img.classList.remove('widthGreaterThanHeight');
    }
  }

  render() {

    return (
      <div className="centerButton">
        <img
          key={`img ${this.props.trailImg}`}
          id={`trail_img`}
          src={require('./assets/trails/' + this.props.trailImg.toLowerCase() + '.png').default}
          alt={this.props.trailImg}
        />
      </div>
    )
  }
}

function ExitButton(props) {
  return (
    <div onClick={props.onClick} className="button-current next">
      <img className='arrowbutton_img' alt='next' src={Arrow} />
    </div>
  )
}

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
      trailImg: this.props.currentTrail,
    };
  }

  getTrailById = (id) => {
    let trail = [];
    if (this.props.trailByMemory[id]) {
      // console.log(this.props.trailByMemory[id]);
      this.props.trailByMemory[id].forEach((el) => {
        const obj = { parcours: el.name, path: el.path };
        trail.push(obj);
      });
    }
    // console.log('les parcours du doc');
    // console.log(trail);
    return trail;
  };

  componentDidMount() {
    let target = [];
    let source = [];
    this.props.linksFromMemory.forEach((obj) => {
      if (Number(obj.source) === Number(this.props.id))
        target.push(obj.target);
      if (Number(obj.target) === Number(this.props.id))
        source.push(obj.source);
    });

    source = source.map((id) => {
      const trail = this.getTrailById(id);
      return {
        id: id,
        parcours: trail,
      };
    });

    target = target.map((id) => {
      const trail = this.getTrailById(id);
      return {
        id: id,
        parcours: trail,
      };
    });

    this.setState({
      sources: source,
      targets: target,
      loadedLinks: true,
    });


    // // TODO display a loader when not loaded yet?
    // console.log(
    //   `Fetching souvenirs from ${ENDPOINT_API}/memory/${this.props.id}`
    // );
    const memoryPath = (this.props.isPreviewGraph)
          ? `${ENDPOINT_API}/memory/${this.props.id}` 
          : `${process.env.PUBLIC_URL}/data/memory/${this.props.id}.json`

    fetch(memoryPath, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
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
            'Oops, something wrong happened when loading memory',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

    const submemPath = (this.props.isPreviewGraph)
      ? ENDPOINT_API + '/submemoryfrommemory/' + this.props.id 
      : ENDPOINT_API + '/submemoryfrommemory/' + this.props.id

    // TODO static data
    fetch(submemPath)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(`Success! submemory ${this.props.id} = `, result);
          this.setState({
            subs: result,
            loadedSubs: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading submemoryfrommemory',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

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

  changeTrailImg = (trail, e) => {
    this.setState({trailImg: trail});
  }

  render() {
    let doc = this.displayDoc(
      'main_doc',
      this.state.memory.format,
      this.state.memory.content,
      this.state.memory.description
    ); // Main document
    let subs = this.props.subs; // Array of secondary documents associated with the main one
    let trail = 'PARCOURS '+this.props.currentTrail.toUpperCase();
    const isLast = this.state.targets.length === 0 && this.state.trails.length >=1;
    return (
      <div className='souvenir'>
        {this.props.currentTrail && <DocHeader trail={trail}/>}

        <div id='memory_and_navigation'>
          
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
        
        </div>

        <div className='docNavigation'>
            <div className='docbuttons'>

              {this.state.sources.map((source) => (
                source.parcours.length > 0 &&
                <DocumentButton
                  key={source.id}
                  id={source.id}
                  onClick={() => this.props.onNextClick(source.id, 'memory')}
                  type='previous'
                  parcours={source.parcours}
                  currentId={this.props.id}
                  currentTrail={this.props.currentTrail}
                  changeTrailImg={this.changeTrailImg}
                />
              ))}

              {this.state.targets.map((target) => (
                <DocumentButton
                  id={target.id}
                  key={target.id}
                  onClick={() => this.props.onNextClick(target.id, 'memory')}
                  type='next'
                  parcours={target.parcours}
                  currentId={this.props.id}
                  currentTrail={this.props.currentTrail}
                  changeTrailImg={this.changeTrailImg}
                />
              ))}

              {isLast && <ExitButton onClick={() => this.props.onNextClick(this.props.id, 'exit')}/>}

              <CenterButton trailImg={this.state.trailImg} />

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
export {CenterButton};