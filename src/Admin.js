import { React, Component } from 'react';
import AdminForm from './AdminForm.js';
import './Admin.css';

import { ENDPOINT_API } from './constants/endpoints';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeLoaded: false,
      linkLoaded: false,
      trailLoaded: false,
      trailByMemoryLoaded: false,
      docOpen: false,
      adminOpen: true,
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
    this.setState({ welcomeOpen: false });
  };

  unsetCurrentMemory = e => {
    this.setState({currentMemory: null});
  }

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

    return (
      <div>
        {trailloaded && this.state.adminOpen && (
          <AdminForm trails={this.state.trail} />
        )}
      </div>
    );
  }
}

export default Admin;
