import { React, PureComponent } from 'react';
import './App.css';
//import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
import Welcome from './Welcome.js';
import Preview from './Preview';
// import { ENDPOINT_API } from './constants/endpoints';
import TrailMessage from './TrailMessage';


class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nodeLoaded: false,
      linkLoaded: false,
      trailLoaded: false,
      trailByMemoryLoaded: false,
      memoriesLoaded: false,
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
    // TODO display a loader when not loaded yet?

    console.log('Fetching node.json');
    fetch(`${process.env.PUBLIC_URL}/data/node.json`, {
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

    console.log('Fetching link.json');
    fetch(`${process.env.PUBLIC_URL}/data/link.json`, {
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

    console.log('Fetching trail.json');
    fetch(`${process.env.PUBLIC_URL}/data/trail.json`, {
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

    console.log('Fetching trailbymemory.json');
    fetch(`${process.env.PUBLIC_URL}/data/trailbymemory.json`, {
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

    console.log('Fetching memories.json');
    fetch(`${process.env.PUBLIC_URL}/data/memories.json`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! (memories)');
          this.setState({
            memories: result,
            memoriesLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading memories',
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
    // data.nodes[nextMem].visited = true;
    this.openMemory(state);
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
      this.state.trailLoaded &&
      this.state.memoriesLoaded;
    // const adminLoaded = this.state.trailLoaded;
    console.log('trailloaded?', trailloaded);
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
            key={memory.id}
            id={memory.id}
            memory={this.state.memories.find((e) => e.id === memory.id)}
            linksFromMemory={this.state.link.filter(
              (e) => e.source === memory.id || e.target === memory.id
            )}
            trailByMemory={this.state.trailByMemory}
            onCrossClick={this.closeMemory}
            onNextClick={this.changeDoc}
          />
        ) : null}
        {this.state.docOpen === 'entry' &&
          <TrailMessage
            state={this.state.docOpen}
            trail={memory.parcours}
          />
        }
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
