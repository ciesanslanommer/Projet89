import { React, Component } from 'react';
import './App.css';
import data from './souvenirs.json';
import Document from './Document.js';
import Trails from './Trails.js';
import Nav from './Nav.js';
import AdminForm from './AdminForm.js';
// import History from './History.js'
import Welcome from './Welcome.js';
//import Zoom from './Zoom.js';

import { ENDPOINT_API } from './constants/endpoints';

class App extends Component {
  constructor(props) {
    super(props);
    const idFirstMem = Math.floor(Math.random() * data.nodes.length);
    this.state = {
      nodeLoaded: false,
      linkLoaded: false,
      trailLoaded : false,
      currentMemory: idFirstMem,
      docOpen: false,
      WelcomeOpen: true,
      adminFormOpen: true,
      node: [],
      link: [],
      trail: [],
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
  }

  closeMemory = (e) => {
    this.setState({ docOpen: false });
    document.querySelector('.App').classList.remove('displayDoc');
  };
  openMemory = (e) => {
    this.setState({ docOpen: true });
  };

  getLinks(nodeId) {
    let sources = data.links
      .map((el) => {
        if (el.target === nodeId)
          return { id: el.source, parcours: data.nodes[el.source].parcours };
        return '';
      })
      .filter((el) => el !== '');
    let targets = data.links
      .map((el) => {
        if (el.source === nodeId)
          return { id: el.target, parcours: data.nodes[el.target].parcours };
        return '';
      })
      .filter((el) => el !== '');
    return { sources, targets };
  }

  changeDoc = (nodeId, visible, e) => {
    /* Graph must be reduced before changing the state of current memory */
    /* Else the current node will be centered on the full window and not the reduced graph */
    document.querySelector('.App').classList.add('displayDoc');

    const nextMem = nodeId;
    this.setState({ currentMemory: nextMem });
    data.nodes[nextMem].visited = true;
    this.openMemory();
  };

  callApi() {
    /*~~~~~~~~~~ Get Request ~~~~~~~~~~*/
    // fetch("http://localhost:3001/souvenirs", {
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8"
    //   }
    // })
    //   .then(res => res.json())
    //   .then(res => console.log(res));
    /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
    //   fetch("http://localhost:3001/souvenirs", {
    //     method : 'POST',
    //     body : JSON.stringify({
    //       name:"Success",
    //       path:"fgdgdfs.png",
    //       nature:"texte"
    //     }),
    //     headers: {
    //       "Content-type": "application/json; charset=UTF-8"
    //     }
    //   })
    //     .then(res => res.json())
    //     .then(res => console.log(res));
    /*~~~~~~~~~~ Delete Request ~~~~~~~~~*/
    // fetch("http://localhost:3001/souvenirs/"+ 28, {
    //   method : 'DELETE',
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8"
    //   }
    // })
    //   .then(res => res.json())
    //   .then(res => console.log(res));
  }

  closeWelcome = (e) => {
    this.setState({ WelcomeOpen: false });
  };

  render() {
    const memory = data.nodes[this.state.currentMemory];
    const loaded = this.state.nodeLoaded && this.state.linkLoaded;
    const adminLoaded = this.state.trailLoaded;
    return (
      <div className='App'>
        {this.state.WelcomeOpen && <Welcome onCrossClick={this.closeWelcome} />}
        {<Nav />}
        {adminLoaded && (
          <AdminForm
          trails={this.state.trail}
          />
        )}
        {loaded && (
          <Trails
            nodeClick={this.changeDoc}
            nodes={this.state.node}
            links={this.state.link}
          />
        )}
        {this.state.docOpen ? (
          <Document
            key={memory.id}
            path={memory.path}
            parcours={memory.parcours}
            links={this.getLinks(memory.id)}
            desc={memory.name}
            nature={memory.nature}
            subs={memory.subs}
            onCrossClick={this.closeMemory}
            onNextClick={this.changeDoc}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
