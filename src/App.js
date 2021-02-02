import { React, PureComponent } from 'react';
import './App.css';
//import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
import Welcome from './Welcome.js';
import Preview from './Preview';
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
    };
  }

  // exemple from https://reactjs.org/docs/faq-ajax.html
  // To be adapted to our app
  componentDidMount() {
    // TODO display a loader when not loaded yet?
    console.log(`Fetching souvenirs from ${ENDPOINT_API}/node/`);
    fetch(ENDPOINT_API + '/node')
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

    console.log(`Fetching souvenirs from ${ENDPOINT_API}/link/`);
    fetch(ENDPOINT_API + '/link')
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

    console.log(`Fetching trail from ${ENDPOINT_API}/trail/`);
    fetch(ENDPOINT_API + '/trail')
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

    console.log(`Fetching trail from ${ENDPOINT_API}/trailbymemory/`);
    fetch(ENDPOINT_API + '/trailbymemory')
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
            'Oops, something wrong happened when loading trail',
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
  }

  closeMemory = (e) => {
    this.setState({ docOpen: false });
    document.querySelector('.App').classList.remove('displayDoc');
  };

  openMemory = (e) => {
    this.setState({ docOpen: true });
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

  changeDoc = (nodeId, e) => {
    /* Graph must be reduced before changing the state of current memory */
    /* Else the current node will be centered on the full window and not the reduced graph */
    document.querySelector('.App').classList.add('displayDoc');
    console.log(nodeId);
    // const nextMem = nodeId;
    this.setState({ currentMemory: nodeId });
    // data.nodes[nextMem].visited = true;
    this.openMemory();
  };

  closeWelcome = (e) => {
    this.setState({ welcomeOpen: false });
  };

  unsetCurrentMemory = (e) => {
    this.setState({ currentMemory: null });
  };

  render() {
    //copy array of obj
    let cpyNode = [];
    this.state.node.forEach((node) => cpyNode.push({ ...node }));
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
    // console.log(trailloaded);
    console.log('render app');
    
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
        {this.state.docOpen ? (
          <Document
            key={memory.id}
            id={memory.id}
            trailByMemory={this.state.trailByMemory}
            onCrossClick={this.closeMemory}
            onNextClick={this.changeDoc}
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
