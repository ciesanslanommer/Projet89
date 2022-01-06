import './Document.css';
import './DocumentButton.css';
// import raw from 'raw.macro';
import React, { PureComponent, Component, useEffect } from 'react';
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';
import CrossroadsPopup from './CrossroadsPopup.js';
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

      if (htmlLink) {
        //htmlNode.classList.remove('inTrail');
        htmlLink.classList.remove('inTrail');
        //htmlNode.classList.add('relatedtoButton');
        htmlLink.classList.add('relatedtoButton');
      }
  }

  removeHighlightDirectionOfButton(currentId, nodeId) {
    const htmlNode = document.querySelector(`[id="${nodeId}"] section`);
    const htmlLink = this.props.type === 'previous' ? 
      document.querySelector(`[id="${nodeId},${currentId}"]`) :
      document.querySelector(`[id="${currentId},${nodeId}"]`);

      if (htmlLink) {
        //htmlNode.classList.add('inTrail');
        htmlLink.classList.add('inTrail');
        //htmlNode.classList.remove('relatedtoButton');
        htmlLink.classList.remove('relatedtoButton');
      }
  }

  onMouseOver = (e) => {
    this.highlightDirectionOfButton(this.props.currentId, this.props.id);
    // const trail = this.props.parcours.length <= 1 ? this.props.parcours[0].parcours : this.props.currentTrail.parcours;


    // ugly last-minute fix
    const parcours = Array.isArray(this.props.parcours)
      ? this.props.parcours.find(e => e.parcours === this.props.currentTrail.parcours) || this.props.parcours.find(e => this.props.allTrails && this.props.allTrails.some(owntrail => owntrail.parcours === e.parcours)) || {parcours: 'inconnu'}
      : this.props.parcours;

    if (this.props.changeTrailImg) {
      this.props.changeTrailImg(parcours.path);
    }

    const {nature, type} = this.props;

    this.props.displayArrowText(true, nature, type, parcours.parcours);
  }

  onMouseOut = (e) => {
    this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id);
    if(this.props.changeTrailImg) this.props.changeTrailImg(this.props.currentTrail.path);
    this.props.displayArrowText(false);
  }

  onClick = () => {
    this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id);
    this.props.displayArrowText(false);
    this.props.onClick(this.props.id);
  }

  render() {
    let props = this.props;
    var type = props.type;
    //this.removeHighlightDirectionOfButton(this.props.currentId, this.props.id);

    let current = this.props.parcours && (Array.isArray(this.props.parcours)
      ? this.props.parcours.some(e => e.parcours === this.props.currentTrail.parcours)
      :this.props.parcours.parcours === this.props.currentTrail.parcours);

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

  render() {

    return (
      <div className="centerButton">
        <img
          key={`img ${this.props.trailImg}`}
          id={`trail_img`}
          src={this.props.trailImg && require('./assets/' + this.props.trailImg.split('.')[0] + '_petit.' + this.props.trailImg.split('.')[1]).default}
          alt={this.props.trailImg}
        />
      </div>
    )
  }
}

function ExitButton(props) {
  return (
    <div onClick={props.onClick} className={`button-current ${props.type}`}>
      <img className='arrowbutton_img' alt={props.type} src={Arrow} 
        onMouseOver={()=>props.displayArrowText(true, props.nature, props.type, props.parcours.parcours)}
        onMouseOut={()=>props.displayArrowText(false)}
        onClick={()=>props.displayArrowText(false)}
      />
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
      crossroadspopupOpen: true,
      trailImg: this.props.currentTrail.path || '',
    };
    this.bound_onKeyDown = this.onKeyDown.bind(this);
  }

  getTrailById = (id) => {
    let trail = [];
    if (this.props.trailByMemory[id]) {
      // //console.log(this.props.trailByMemory[id]);
      this.props.trailByMemory[id].forEach((el) => {
        const obj = { parcours: el.name, path: el.path, entry: el.entry };
        trail.push(obj);
      });
    }
    // //console.log('les parcours du doc');
    // //console.log(trail);
    return trail;
  };

  componentWillMount() {
    document.addEventListener("keydown", this.bound_onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.bound_onKeyDown);
  }

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
    // //console.log(
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
          //console.log(`Success! memory ${this.props.id} = `, result);
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

/*    const submemPath = (this.props.isPreviewGraph)
      ? ENDPOINT_API + '/submemoryfrommemory/' + this.props.id 
      : ENDPOINT_API + '/submemoryfrommemory/' + this.props.id

    // TODO static data
    fetch(submemPath)
      .then((res) => res.json())
      .then(
        (result) => {
          //console.log(`Success! submemory ${this.props.id} = `, result);
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
*/
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
      case 'youtube':
        return <Video key={id} path={content} parcours={this.state.trails} />;
      default:
        return <p key={id}>{this.state.memory.format}</p>;
    }
  }

  closeCrossroadsPopup = (e) => {
    this.setState({ crossroadspopupOpen: false });
  };

  changeTrailImg = (trail, e) => {
    this.setState({trailImg: trail});
  }

  getTrailIdOfFirst() {
    let parcours;
    let path;
    let id = -1;
    for(let i=0; i<this.props.entries.length; i++) {
      for(let j=0; j<this.state.sources.length; j++) {
        if(this.state.sources[j].id === this.props.entries[i].id) {
          id = this.props.entries[i].id;
          parcours = this.props.entries[i].parcours;
          path = this.props.entries[i].path;
        }
      } 
    }
    return {id: id, parcours: parcours, path: path,};
  }

  // please don't use this code as an example of good practice :-p (@agr)
  onKeyDown(e) {
    return; // TODO to fix later
    if (e.code === 'ArrowRight' || e.code === 'ArrowUp') {
      if (e.code === 'ArrowRight') {
        // check if we are at the end
        const isLast = this.state.targets.length === 0 && this.state.trails.length >=1;
        if (isLast) {
          this.props.onNextClick(this.props.id, 'exit');
        }
      }
      for (const i in this.state.targets) {
        const target = this.state.targets[i];
        if (target && target.parcours) {
          const parcours = target.parcours.length > 1 ? this.props.currentTrail : target.parcours[0]
          const isCurrent = this.props.currentTrail.parcours === parcours.parcours;
          if (isCurrent && e.code === 'ArrowRight') {
            this.props.onNextClick(target.id, 'memory');
          } else if (!isCurrent && e.code === 'ArrowUp') {
            this.props.onNextClick(target.id, 'memory');
          }
        }
      }
    } else if (e.code === 'ArrowLeft' || e.code === 'ArrowDown') {
      if (e.code === 'ArrowLeft') {
        // check if we are at the beginning
        const idOfFirst = this.getTrailIdOfFirst().id;
        if (idOfFirst !== -1) {
          this.props.onNextClick(idOfFirst, 'entry')
        }
      }
      for (const i in this.state.sources) {
        const source = this.state.sources[i];
        if (source && source.parcours) {
          if (source.parcours[0] && source.parcours[0].entry) {
            continue;
          }
          const parcours = source.parcours.length > 1 ? this.props.currentTrail : source.parcours[0]
          const isCurrent = this.props.currentTrail.parcours === parcours.parcours;
          if (isCurrent && e.code === 'ArrowLeft') {
            this.props.onNextClick(source.id, 'memory');
          } else if (!isCurrent && e.code === 'ArrowDown') {
            this.props.onNextClick(source.id, 'memory');
          }
        }
      }
    }
  }

  render() {
    let cpyNode = [];
    this.props.node.concat(this.props.trail).forEach((node) => cpyNode.push({ ...node }));
    //find current node
    let id = cpyNode.findIndex(
      (node) => Number(node.id) === Number(this.props.id)
    );
    const isCrossRoad = cpyNode[id].entry ? false : cpyNode[id].trails.length>1;
    let doc = this.displayDoc(
      'main_doc',
      this.state.memory.format,
      this.state.memory.content || this.state.memory.youtube,
      this.state.memory.description
    ); // Main document
    let subs = this.props.subs; // Array of secondary documents associated with the main one
    let trail = this.props.currentTrail && this.props.currentTrail.parcours
      ? 'PARCOURS '+this.props.currentTrail.parcours.toUpperCase()
      : 'PARCOURS INCONNU';

    // it's the last memory if there is not more target memory also present in the current trail
    // another ugly line
    const isLast = this.state.targets.filter(a => a.parcours.find(b => b.parcours === this.props.currentTrail.parcours)).length === 0 && this.state.trails.length >=1;
    
    return (
      <div className='souvenir'>
        {trail !== 'PARCOURS' && <div id='trail_info'>
          <h1>{trail}</h1>
        </div>}
        {isCrossRoad && this.state.crossroadspopupOpen && <CrossroadsPopup trail={this.props.currentTrail.parcours} onCrossClick={this.closeCrossroadsPopup} />}

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
              {
                this.state.memory.caption && (<p>{this.state.memory.caption}</p>)
              }
            </div>
          </div>
        
        </div>

        <div className='docNavigation'>
            {this.props.arrowText}
            <div className='docbuttons'>
              {this.state.sources.map((source) => (
                source.parcours && source.parcours[0] &&
                !source.parcours[0].entry &&
                (source.parcours.find(e => e.parcours === this.props.currentTrail.parcours) || source.parcours.find(e => this.state.trails && this.state.trails.some(owntrail => owntrail.parcours === e.parcours)))
                &&
                <DocumentButton
                  key={source.id}
                  id={source.id}
                  onClick={id => this.props.onNextClick(id, 'memory')}
                  type='previous'
                  parcours={source.parcours}
                  currentId={this.props.id}
                  currentTrail={this.props.currentTrail}
                  allTrails={this.state.trails}
                  changeTrailImg={this.changeTrailImg}
                  displayArrowText={this.props.displayArrowText}
                  nature="memory"
                />
              ))}

              {this.state.targets.map((target) => (
                <DocumentButton
                  id={target.id}
                  key={target.id}
                  onClick={id => this.props.onNextClick(id, 'memory')}
                  type='next'
                  parcours={target.parcours}
                  currentId={this.props.id}
                  currentTrail={this.props.currentTrail}
                  allTrails={this.state.trails}
                  changeTrailImg={this.changeTrailImg}
                  displayArrowText={this.props.displayArrowText}
                  nature="memory"
                />
              ))}

              {isLast && <ExitButton 
                type='next' 
                onClick={() => this.props.onNextClick(this.props.id, 'exit')}
                parcours={this.props.currentTrail}
                nature="exit"
                displayArrowText={this.props.displayArrowText}
              />}
              
              {this.getTrailIdOfFirst().id!==-1 && 
                <DocumentButton
                  id={this.getTrailIdOfFirst().id}
                  key={this.getTrailIdOfFirst().id}
                  onClick={() => this.props.onNextClick(this.getTrailIdOfFirst().id, 'entry')}
                  type='previous'
                  parcours={this.getTrailIdOfFirst()}
                  currentId={this.props.id}
                  currentTrail={this.props.currentTrail}
                  allTrails={this.state.trails}
                  changeTrailImg={this.changeTrailImg}
                  displayArrowText={this.props.displayArrowText}
                  nature="entry"
                />
              }

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
export {CenterButton, DocumentButton, ExitButton};