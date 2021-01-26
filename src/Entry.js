import { React, Component } from 'react';
import './Entry.css';

class Entry extends Component {
  render() {
    return (
      <img
        className='iconstrails'
        // src={require('./assets/' + this.props.path).default}
        src={require('./assets/ruines.png').default}
        alt='icontrails'
      ></img>
    );
  }
}

export default Entry;
