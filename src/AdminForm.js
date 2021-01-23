import { React, Component } from 'react';
import './AdminForm.css';

import { ENDPOINT_API } from './constants/endpoints';

class AdminForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            description: "",
            format: "",
            date: "",
            icon_id: "",
            trails: this.props.trails,
            icon: [],
            iconLoaded: false,
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

    // getValue = (event) => {
    //     let value = event.target.value
    //     console.log(value)
    //     return (value)
    // }

    handleChangeTitle = (event) => {
        let value = event.target.value
        console.log(value)
        this.setState({ name: value })
    }

  handleChangeContent = (event) => {
    let value = event.target.value;
    console.log(value);
    this.setState({ description: value });
  };

    displayDoc = (format) => {
        switch (format) {
            case 'image':
                return (
                    <div>
                        <label>Ajouter une image au souvenir :</label>
                        <input type="file" name="blobcontain" />
                    </div>
                )
            case 'video':
                return (
                    <div>
                        <label>Ajouter une vidéo au souvenir :</label>
                        <input type="file" name="blobcontain" />
                    </div>
                )
            case 'youtube':
                return (
                    <div>
                        <label>Ajouter un lien vers la vidéo :</label>
                        <input type="text" name="linkToYoutube" />
                    </div>
                )
            default:
                return (
                    <div>
                        <label>Quel est votre texte ? :</label>
                        <textarea name="textArea" rows="15" cols="70"></textarea>
                    </div>
                )
        }
    }

    getFormat = (event) => {
        let value = event.target.value
        console.log(value)
        this.setState({ format: value })
    }

    getDate = (event) => {
        let value = event.target.value
        console.log(event.target.value)
        this.setState({ date: value })
    }

    getIcon = (event) => {
        let value = event.target.value
        console.log(event.target.value)
        this.setState({ icon_id: value })
    }

    postRequest(name, description, format, date, icon_id) {
        /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
        fetch(ENDPOINT_API + '/memory', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                description: description,
                format: format,
                content: "",
                date: date,
                icon_id: icon_id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                const value = ''
                this.setState({ name: value, description: value, format: value, date: value })
                alert("Votre souvenir a bien été en registré !")
            }
            );
    }

  render() {
    const { title, content } = this.state;
    let icon = this.state.icon;
    return (
      <form className='adminForm'>
        <label>Titre du souvenir : </label>
        <input
          value={this.state.title}
          type='text'
          placeholder='Chute du mur'
          onChange={this.handleChangeTitle}
        />
        <label>Résumé : </label>
        <input
          value={this.state.content}
          type='text'
          placeholder='ex : mur de Berlin'
          onChange={this.handleChangeContent}
        />
        <label>Format du fichier : </label>
        <select name='format' id='format_id'>
          <option value='image'>Image</option>
          <option value='video'>Vidéo</option>
          <option value='youtube'>Lien Youtube</option>
          <option value='texte'>Texte</option>
        </select>
        <label>Date du souvenir : </label>
        <input className='inputFichier' type='date' />
        <label>Icone de souvenir : </label>
        <select name='icons' id='icon_id'>
          {icon.map((icon) => {
            return (
              <option key={icon.id} value={icon.id}>
                {icon.name}
              </option>
            );
          })}
        </select>
        <label>
          Choix du parcours : (un souvenir peut en avoir 0 ou plusieurs){' '}
        </label>
        {this.props.trails.map((trail) => {
          return (
            <div>
              <input
                type='checkbox'
                id={trail.id}
                key={trail.id}
                name={trail.name}
                value={trail.name}
              />
              <label for={trail.id}>{trail.name}</label>
            </div>
          );
        })}
        <label>Ajouter un fichier au souvenir :</label>
        <input className='inputFichier' type='file' name='blobcontain' />
        <button type='button' onClick={() => this.postRequest(title, content)}>
          Ajouter
        </button>
      </form>
    );
  }
}

    render() {
        const { name, description, format, date, icon_id } = this.state
        let icon = this.state.icon
        return (
            <form className='adminForm'>
                <label>Titre du souvenir <abbr> * </abbr></label>
                <input required className = "require" value={this.state.title} type='text' placeholder='Chute du mur' onChange={this.handleChangeTitle} />
                <label>Description  <abbr> * </abbr> </label>
                <textarea required className = "require" name="description" rows="3" cols="33" placeholder='ex : mur de Berlin'  maxlength = "95" onChange={this.handleChangeContent}></textarea>
                <label>Format du fichier  </label>
                <select name="format" id="format_id" onChange={this.getFormat}>
                    <option value="texte">Texte</option>
                    <option value="video">Vidéo</option>
                    <option value="youtube">Lien Youtube</option>
                    <option value="image">Image</option>
                </select>
                {
                    this.displayDoc(this.state.format)
                }
                <label>Date de récolte du souvenir <abbr> * </abbr> </label>
                <input required className = "require" type="date" onChange={this.getDate} />
                <label>Icone de souvenir  </label>
                <select name="icons" id="icon_id" onChange={this.getIcon}>
                    {icon.map((icon) => {
                        return (<option value={icon.id}>{icon.name}</option>)
                    })}
                </select>
                {/* <label>Choix du parcours : (un souvenir peut en avoir 0 ou plusieurs) </label>
                {this.state.trails.map((trail) => {
                    return (
                        <div>
                            <input type="checkbox" id={trail.id} name={trail.name} value={trail.name} />
                            <label for={trail.id}>{trail.name}</label>
                        </div>
                    )

                })} */}
                <button type="button" onClick={() => this.postRequest(name, description, format, date, icon_id)}>Créer un souvenir</button>
            </form>
        )
    };
}

export default AdminForm