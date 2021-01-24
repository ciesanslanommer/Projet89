import { React, Component } from 'react';
import './AdminForm.css';

import { ENDPOINT_API } from './constants/endpoints';

class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      format: 'texte',
      date: '',
      icon_id: '',
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

    getValue = (stateKey, event) => {
        let value = event.target.value
        console.log(value)
        this.setState({ [stateKey]: value })
  }

  displayDoc = (format) => {
    switch (format) {
      case 'image':
        return (
          <div>
            <label>Ajouter une image au souvenir :</label>
            <input type='file' name='blobcontain' />
          </div>
        );
      case 'video':
        return (
          <div>
            <label>Ajouter une vidéo au souvenir :</label>
            <input type='file' name='blobcontain' />
          </div>
        );
      case 'youtube':
        return (
          <div>
            <label>Ajouter un lien vers la vidéo :</label>
            <input type='text' name='linkToYoutube' />
          </div>
        );
      default:
        return (
          <div>
            <label>Quel est votre texte ? :</label>
            <textarea name='textArea' rows='15' cols='70'></textarea>
          </div>
        );
    }
  };

  postRequest(name, description, format, date, icon_id) {
      if(name === '' || description === '' || date === ''){
          alert('Des champs obligatoires ne sont pas remplis')
          return;
      }
    /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
    fetch(ENDPOINT_API + '/memory', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        description: description,
        format: format,
        content: '',
        date: date,
        icon_id: icon_id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const value = '';
        this.setState({
          name: value,
          description: value,
          format: value,
          date: value,
        });
        alert('Votre souvenir a bien été en registré !');
      });
  }

  render() {
    const { name, description, format, date, icon_id } = this.state;
    let icon = this.state.icon;
    console.log(this.props.trails)
    return (
      <form className='adminForm'>
        <label>Titre du souvenir <abbr> * </abbr></label>
        <input
            required
            className = "require"
            value={this.state.name}
            type='text'
            placeholder='Chute du mur'
            onChange={(e) => this.getValue("name", e)}
        />
        <label>Description <abbr> * </abbr></label>
        <textarea required className = "require" name="description" row="3" cols="33" placeholder='ex : mur de Berlin' maxlength="95" onChange={(e) => this.getValue("description", e)}></textarea>
        <label>Format du fichier <abbr> * </abbr></label>
        <select required className="require" name='format' id='format_id' onChange={(e) => this.getValue("format", e)}>
          <option value='texte'>Texte</option>
          <option value='video'>Vidéo</option>
          <option value='youtube'>Lien Youtube</option>
          <option value='image'>Image</option>
        </select>
        {
            this.displayDoc(this.state.format)
        }
        <label>Date du souvenir <abbr> * </abbr></label>
        <input required className = "require"  type='date' onChange={(e) => this.getValue("date", e)}/>
        <label>Icone de souvenir </label>
        <select name='icons' id='icon_id' onChange={(e) => this.getValue("icon_id", e)}>
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
            console.log(trail)
          return (
            <div>
              <input
                type='checkbox'
                id={trail.id}
                key={trail.id}
                name={trail.parcours}
                value={trail.parcours}
              />
              <label for={trail.id}>{trail.parcours}</label>
            </div>
          );
        })}
        <button type='button' onClick={() => this.postRequest(name, description, format, date, icon_id)}>
          Créer un souvenir
        </button>
      </form>
    );
  }
}

export default AdminForm;
