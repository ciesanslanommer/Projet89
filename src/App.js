import { React, PureComponent, memo } from 'react';
import ReactGA from 'react-ga';
import './App.css';
import './Menu.css';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
import Menu from './Menu.js';
import Popup from './popups/Popup.js';
import Welcome from './popups/Welcome.js';
import Projet89 from './popups/Projet89.js';
import Collecte from './popups/Collecte.js';
import Preview from './Preview';
import TrailMessage from './TrailMessage';
import { ENDPOINT_API } from './constants/endpoints';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodeLoaded: false,
      linkLoaded: false,
      trailLoaded: false,
      trailByMemoryLoaded: false,
      popupOpen: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'aide', // 'aide' / 'projet89' / 'collecte' / 'mobile' (for mobile device users warning)
      docOpen: false,
      adminOpen: false,
      previewOpen: null,
      node: [],
      link: [],
      trail: [],
      trailByMemory: [],
      memories: [],
    };

    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-195143568-1');
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  // exemple from https://reactjs.org/docs/faq-ajax.html
  // To be adapted to our app
  componentDidMount() {
    let path =`${process.env.PUBLIC_URL}/data/`
    let node = `node.json`
    let link = 'link.json'
    let trail = 'trail.json'
    let trailByMem = 'trailbymemory.json'

    if (this.props.preview){
      path = `${ENDPOINT_API}/`
      node = 'node'
      link = 'link'
      trail = 'trail'
      trailByMem = 'trailbymemory'
    }

    ////console.log('Fetching from' + node);
    fetch(path + node, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          ////console.log('Success! node = ', result);
          this.setState({
            node: result,
            nodeLoaded: true,
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

    ////console.log('Fetching ' + link);
    fetch(path + link, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          //console.log('Success! link = ', result);
          this.setState({
            // remove potential duplicated tuples (e.source, e.target) - cf https://stackoverflow.com/a/56757215/4503757 
            link: [...new Map(result.map(v => [JSON.stringify([v.source,v.target]), v])).values()],
            linkLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading link',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

    ////console.log('Fetching ' + trail);
    fetch(path + trail, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          //console.log('Success! trail = ', result);
          this.setState({
            trail: result,
            trailLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading trail',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

    ////console.log('Fetching ' + trailByMem);
    fetch(path + trailByMem, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          //console.log('Success! trail by memory = ', result);
          this.setState({
            trailByMemory: result,
            trailByMemoryLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading trailbymemory',
            error
          );
          // TODO maybe display an error for the user?
        }
      );
  }
  
  componentWillUnmount() {
    document.querySelectorAll('.node').forEach((node) => {
      node.removeEventListener('mouseover', this.openPreview);
      node.removeEventListener('mouseout', this.closePreview);
    });
  };

  closeMemory = (e) => {
    this.setState({ docOpen: false });
    document.querySelector('.App').classList.remove('displayDoc');
  };

  openMemory = (state, e) => {
    this.setState({ docOpen: state });
  };

  openPreview = (node, name, desc, entry, e) => {
    const boundNode = node.getBoundingClientRect();
    this.setState({
      previewOpen: {
        x: boundNode.x - boundNode.width / 2,
        y: boundNode.y + boundNode.height / 2,
        sizeNode: boundNode.width,
        name: name,
        desc: desc,
      },
    });
  };

  closePreview = (e) => {
    this.setState({ previewOpen: null });
  };

  changeDoc = (nodeId, state, e) => {
    /* Graph must be reduced before changing the state of current memory */
    /* Else the current node will be centered on the full window and not the reduced graph */
    document.querySelector('.App').classList.add('displayDoc');
    // const nextMem = nodeId;
    this.setState({ currentMemory: nodeId });

    let cpyNode = [];
    this.state.node.concat(this.state.trail).forEach((node) => cpyNode.push({ ...node }));
    //find current node
    let id = cpyNode.findIndex(
      (node) => Number(node.id) === Number(nodeId)
    );
    // currentTrail changes when changing trail or opening doc/entry
    // but should not change on a crossroad
    const trail = cpyNode[id].entry ? cpyNode[id].parcours : cpyNode[id].trails[0];
    const isNotCrossRoad = cpyNode[id].entry ? true : cpyNode[id].trails.length<=1;
    if(!this.state.currentTrail || (this.state.currentTrail !== trail && isNotCrossRoad)) {
      this.setState({currentTrail: trail})
    }

    // data.nodes[nextMem].visited = true;
    this.openMemory(state);
  };

  closePopup = (e) => {
    this.setState({ popupOpen: '' });
  };

  unsetCurrentMemory = (e) => {
    this.setState({ currentMemory: null, currentTrail: null });
  };

  trailByMemoryPlusEntries() {
    let res = this.state.trailByMemory;
    this.state.trail.forEach(trail => {
      let formattedTrail = {
        id: trail.id,
        name: trail.parcours,
        path: trail.path,
        entry: trail.entry,
      }
      res[formattedTrail.id] = [formattedTrail];
    });
    return res;
  }

  formattedCurrentTrail() {
    let res;
    this.state.trail.forEach(trail => {
      if(trail.parcours===this.state.currentTrail) {
        res = {parcours: trail.parcours, path: trail.path, entry_message: trail.entry_message};
      }
    });
    return res;
  }

  displayArrowText = (display, nature, type, trail, e) => {
    let typebis = type === "next" ? "Suivant" : "Précédent";
    let text;
    if(nature==="entry") {
      text = <p className={`buttontext-${type}`}>{`Début du parcours ${trail}`}</p>;
    }
    else if(nature==="memory") {
      text = <p className={`buttontext-${type}`}>{`${typebis} dans le parcours ${trail}`}</p>;
    }
    else if(nature==="exit"){
      text = <p className={`buttontext-${type}`}>{`Fin du parcours ${trail}`}</p>;
    }
    else {
      text = null;
    }

    if(display) {
      this.setState({arrowText: text});
    }
    else{
      this.setState({arrowText: null});
    }
    
  }

  onClickOnMenu = item => {
    this.setState({ popupOpen: item });
  }

  closeMobileWarning = () => {
    this.setState({ popupOpen: 'aide' })
  }

  render() {
    //copy array of obj
    let cpyNode = [];
    this.state.node.concat(this.state.trail).forEach((node) => cpyNode.push({ ...node }));
    //find current node
    let id = cpyNode.findIndex(
      (node) => Number(node.id) === Number(this.state.currentMemory)
    );
    let memory = cpyNode[id];
    
    const trailloaded =
      this.state.nodeLoaded &&
      this.state.linkLoaded &&
      this.state.trailByMemoryLoaded &&
      this.state.trailLoaded;
    // const adminLoaded = this.state.trailLoaded;
    // //console.log('trailloaded?', trailloaded);
    //console.log(this.formattedCurrentTrail());

    return (
      <div className='App'>
        {
          this.state.popupOpen === 'mobile' && <Popup onClose={this.closeMobileWarning}>Ce site n'étant pas optimisé pour les appareils mobiles pour le moment, nous vous invitons à tester sur ordinateur.</Popup>
        }
        {
          this.state.popupOpen === 'aide' && <Welcome onClose={this.closePopup} />
        }
        {
          this.state.popupOpen === 'projet89' && <Projet89 onClose={this.closePopup} />
        }
        {
          this.state.popupOpen === 'collecte' && <Collecte onClose={this.closePopup} />
        }

        {<Nav />}

        <Menu
          showAdmin={this.props.preview}
          onClick={this.onClickOnMenu}
        />

        {trailloaded && (
          <Trails
            nodeClick={this.changeDoc}
            nodes={this.state.node}
            links={this.state.link}
            trailsByMemory={this.trailByMemoryPlusEntries()}
            trails={this.state.trail}
            currentMemory={this.state.currentMemory}
            docOpen={this.state.docOpen}
            closeDoc={this.closeMemory}
            unsetCurrentMemory = {this.unsetCurrentMemory}
            openPreview = {this.openPreview}
            closePreview = {this.closePreview}
          />
        )}
        {this.state.docOpen === 'memory' ? (
          <Document
            isPreviewGraph = {this.props.preview}
            key={memory.id}
            id={memory.id}
            trail={this.state.trail}
            node={this.state.node}
            linksFromMemory={this.state.link.filter(
              (e) => e.source === memory.id || e.target === memory.id
            )}
            trailByMemory={this.state.trailByMemory}
            onCrossClick={this.closeMemory}
            onNextClick={this.changeDoc}
            currentTrail={this.state.currentTrail ? this.formattedCurrentTrail() : "Default"}
            entries={this.state.trail}
            displayArrowText={this.displayArrowText}
            arrowText={this.state.arrowText}
          />
        ) : null}
        {this.state.docOpen === 'entry' || this.state.docOpen === 'exit' ? (
          <TrailMessage
            state={this.state.docOpen}
            trail={this.state.currentTrail ? this.formattedCurrentTrail() : "Default"}
            onNextClick={this.changeDoc}
            closeDoc={this.closeMemory}
            id={memory.id}
            entries={this.state.trail}
            displayArrowText={this.displayArrowText}
            arrowText={this.state.arrowText}
          />
        ) : null}
        {this.state.previewOpen != null && (
          <Preview
            pos={{ x: this.state.previewOpen.x, y: this.state.previewOpen.y }}
            name={this.state.previewOpen.name}
            size={this.state.previewOpen.sizeNode}
            desc={this.state.previewOpen.desc}
          />
        )}
      </div>
    );
  }
}

export default App;
