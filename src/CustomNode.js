import { React, PureComponent } from 'react';
import './CustomNode.css';
const classNames = require('classnames');

class CustomNode extends PureComponent {
  render() {
    const highlighted = this.props.highlighted;
    const visited = this.props.visited;
    const visible = this.props.zoom > this.props.nodeZoom ? true : false;
    ////console.log("this.props.zoom : " + this.props.zoom)
    ////console.log("this.props.nodeZoom : " + this.props.nodeZoom)
    ////console.log("visible : " + visible)

    if (!visible)
      return (
        <div
          className={classNames({
            visible: visible,
            invisible: !visible && !visited,
            invisibleVisited: !visible && visited,
          })}
        ></div>
      );

    return (
      <div
        className={classNames({
          visible: visible,
          invisible: !visible && !visited,
          invisibleVisited: !visible && visited,
          highlighted: highlighted,
        })}
      >
        {/* {highlighted ? <Preview resume = {this.props.name} /> : ""} */}
        {visited ? (
          <img
            className='icons visited'
            src={require('./assets/' + this.props.path).default}
            alt='icon'
          ></img>
        ) : (
          <img
            className='icons'
            src={require('./assets/' + this.props.path).default}
            alt='icon'
          ></img>
        )}
      </div>
    );
  }
}

export default CustomNode;
