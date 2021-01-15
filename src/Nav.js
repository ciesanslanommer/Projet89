import React, {Component} from "react";
import './Nav.css'


class Nav extends Component {
    
    state = {
        request: "",
        boolean: true
   };

   handleChange = (event) => {
        this.setState({request: event.currentTarget.value});
   };
    
   closeSearch = (event) => {
        this.setState({boolean : true});
        console.log(this.state.boolean);
        this.state.value = "";
   };

    openSearch = (event) => { 
        this.setState({boolean : false});
        console.log(this.state.boolean);
        this.state.value = event.currentTarget.value;
    };

    collectInfo = (event) => {
        
        if (event.key === 'Enter') {
            event.preventDefault(); 

            this.setState({request : this.state.value});
            console.log(this.state.request + " valeur de request ");
          }
    };

    
    render(desc){
        const searchClass = this.state.boolean ? "search" : "searchDis"
        const icons = this.state.boolean ? "loupe" : "close"
        
        return (
            <form className = "form" onSubmit={this.collectInfo}>
                <img src={require('./../src/icons/' + icons + '.png').default} alt={desc} onClick={this.state.boolean ? this.openSearch : this.closeSearch}></img> 
                <input value={this.state.value} onChange={this.handleChange} onKeyDown={this.collectInfo} className={searchClass} type="text" placeholder="Recherche" />
            </form>
        )
        
    }
};

export default Nav;