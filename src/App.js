import { React, PureComponent, memo } from 'react';
import './App.css';
//import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
import Welcome from './Welcome.js';
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
      docOpen: false,
      adminOpen: false,
      welcomeOpen: true,
      previewOpen: null,
      node: [],
      link: [],
      trail: [],
      trailByMemory: [],
      memories: [],
    };
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

    console.log('Fetching from' + node);
    fetch(path + node, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! node = ', result);
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

    console.log('Fetching ' + link);
    fetch(path + link, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! link = ', result);
          this.setState({
            link: result,
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

    console.log('Fetching ' + trail);
    fetch(path + trail, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! trail = ', result);
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

    console.log('Fetching ' + trailByMem);
    fetch(path + trailByMem, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! trail by memory = ', result);
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
    console.log('CLOSED');
  };

  openMemory = (state, e) => {
    this.setState({ docOpen: state });
  };

  openPreview = (node, name, desc, entry, e) => {
    if (entry) {
      return;
    }
    const boundNode = node.getBoundingClientRect();
    this.setState({
      previewOpen: {
        x: boundNode.x,
        y: boundNode.y,
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

  closeWelcome = (e) => {
    this.setState({ welcomeOpen: false });
  };

  unsetCurrentMemory = (e) => {
    this.setState({ currentMemory: null, currentTrail: null });
  };

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
    // console.log('trailloaded?', trailloaded);
    return (
      <div className='App'>
        {this.state.welcomeOpen && <Welcome onCrossClick={this.closeWelcome} />}
        {<Nav />}
        {trailloaded && (
          <Trails
            nodeClick={this.changeDoc}
            nodes={this.state.node}
            links={this.state.link}
            trailsByMemory={this.state.trailByMemory}
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
            linksFromMemory={this.state.link.filter(
              (e) => e.source === memory.id || e.target === memory.id
            )}
            trailByMemory={this.state.trailByMemory}
            onCrossClick={this.closeMemory}
            onNextClick={this.changeDoc}
            currentTrail={this.state.currentTrail}
          />
        ) : null}
        {this.state.docOpen === 'entry' || this.state.docOpen === 'exit' ? (
          <TrailMessage
            state={this.state.docOpen}
            trail={this.state.currentTrail}
            onNextClick={this.changeDoc}
            closeDoc={this.closeMemory}
            id={memory.id}
            entries={this.state.trail}
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
