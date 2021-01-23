import { React, Component } from 'react';
import './AdminForm.css'

import { ENDPOINT_API } from './constants/endpoints';

class AdminForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            description: "",
            format: "",
            trails: this.props.trails,
            icon: [],
            iconLoaded : false,

        };
    }
    componentDidMount() {
        // TODO display a loader when not loaded yet?
        console.log(`Fetching souvenirs from ${ENDPOINT_API}/icon/`);
        fetch(ENDPOINT_API + '/icon')
          .then((res) => res.json())
          .then(
            (result) => {
              console.log('Success! icon = ', result);
              this.setState({
                icon: result,
                iconLoaded: true,
              });
            },
            (error) => {
              console.error(
                'Oops, something wrong happened when loading icons',
                error
              );
              // TODO maybe display an error for the user?
            }
          );
    }

    handleChangeTitle = (event) => {
        let value = event.target.value
        console.log(value)
        this.setState({ name: value })
    }

    handleChangeContent = (event) => {
        let value = event.target.value
        console.log(value)
        this.setState({ description: value })
    }

    postRequest(name, description, format, icon_id) {
        /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
        fetch("http://localhost:3001/memory", {
            method: 'POST',
            body: JSON.stringify({
                name: "bonjour",
                description: "vbgnj,k;:",
                format: "image",
                content: "test de content",
                date : "1989-11-11",
                icon_id: "2"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(res => console.log(res));
    }


    render() {
        const { title, content } = this.state
        let icon = this.state.icon
        return (
            <form className='adminForm'>
                <label>Titre du souvenir : </label>
                <input value={this.state.title} type='text' placeholder='Chute du mur' onChange={this.handleChangeTitle} />
                <label>Résumé : </label>
                <input value={this.state.content} type='text' placeholder='ex : mur de Berlin' onChange={this.handleChangeContent} />
                <label>Format du fichier : </label>
                <select name="format" id="format_id">
                    <option value="image">Image</option>
                    <option value="video">Vidéo</option>
                    <option value="youtube">Lien Youtube</option>
                    <option value="texte">Texte</option>
                </select>
                <label>Date du souvenir : </label>
                <input className="inputFichier" type="date" />
                <label>Icone de souvenir : </label>
                <select name="icons" id="icon_id">
                {icon.map((icon) => {
                    return (<option value={icon.id}>{icon.name}</option>)
                })}
                </select>
                <label>Choix du parcours : (un souvenir peut en avoir 0 ou plusieurs) </label>
                {this.state.trails.map((trail) => {
                    return (
                        <div>
                            <input type="checkbox" id={trail.id} name={trail.name} value={trail.name} />
                            <label for={trail.id}>{trail.name}</label>
                        </div>
                    )

                })}
                <label>Ajouter un fichier au souvenir :</label>
                <input className="inputFichier" type="file" name="blobcontain" />
                <button type="button" onClick={() => this.postRequest(title, content)}>Ajouter</button>
            </form>
        )
    };
}

export default AdminForm