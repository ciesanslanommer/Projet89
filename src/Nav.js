import React, {PureComponent} from "react";
import './Nav.css';


class Nav extends PureComponent {
    
    state = {
        request: "",
        boolean: true
   };

    handleChange = (event) => {
        let newRequest = event.target.value
        this.setState({request : newRequest})
    };
    
   closeSearch = (event) => {
        this.setState({boolean : true});
        this.setState({request : ""});
   };

    openSearch = (event) => { 
        this.setState({boolean : false});
    };

    collectInfo = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            //send request to app
            //console.log(this.state.request + " valeur de request ");
        }
    };

    
    render(desc){
        const searchClass = this.state.boolean ? "search" : "searchDis"
        const icons = this.state.boolean ? "loupe" : "close"
        
        return (
            <form className = "searchForm" onSubmit={this.collectInfo}>
                <img 
                    src={require('./../src/assets/' + icons + '.png').default} 
                    alt={desc} 
                    onClick={this.state.boolean ? this.openSearch : this.closeSearch}
                ></img> 
                <input 
                    value={this.state.request}
                    onChange={this.handleChange} 
                    onKeyDown={this.collectInfo} 
                    className={searchClass} 
                    type="text" 
                    placeholder="Recherche" 
                />
            </form>
        )
        
    }
};

export default Nav;