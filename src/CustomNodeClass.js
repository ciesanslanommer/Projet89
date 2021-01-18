import {React, Component} from 'react';

class CustomNodeClass extends Component{
    // let doc = this.displayDoc('main_doc', this.props.nature, this.props.path); // Main document
    // let subs = this.props.subs; // Array of secondary documents associated with the main one
    render () {
        console.log(this.props.nature)
        console.log(this.props.highlighted)
        return (
            <div>Hello</div>
        )
    };
}

export default CustomNodeClass;