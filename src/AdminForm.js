import {React, Component} from 'react';

class AdminForm extends Component {

    constructor(props){
        super(props)
        this.state = {
         title : "",
         content : ""
        };
      }

    handleChangeTitle = (event) => {
        let value = event.target.value
        console.log(value)
        this.setState({title : value})
    } 

    handleChangeContent = (event) => {
        let value = event.target.value
        console.log(value)
        this.setState({content : value})
    } 

    postRequest(title, content){
        /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
        fetch("http://localhost:3001/souvenirs", {
        method : 'POST',
        body : JSON.stringify({
            title: title,
            content: content,
        }),
        headers: { 
            "Content-type": "application/json; charset=UTF-8"
        } 
        })
        .then(res => res.json())
        .then(res => console.log(res));
    }

    render() {
        const {title, content} = this.state
        return (
            <form>
                <label>Titre du souvenir : </label>
                <input value = {this.state.title} type='text' placeholder='Chute du mur' onChange = {this.handleChangeTitle}/>
                <label>Description : </label>
                <input value = {this.state.content} type='text' placeholder='Description' onChange = {this.handleChangeContent}/>
                <button type="button" onClick = {() => this.postRequest(title, content)}>Ajouter</button>
            </form>
        )
    };
}

export default AdminForm