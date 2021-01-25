import { React, Component } from 'react';
import './AdminForm.css';

import { ENDPOINT_API } from './constants/endpoints';

class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      format: '',
      date: '',
      icon_id: '',
      target_id: '',
      contributeur: '',
      keyword_id: '',
      keyword: '',
      newTrailName: '',
      subFormat: '',
      icons: [],
      iconLoaded: false,
      submemories: [],
      submemoryLoaded: false,
      keywords: [],
      keywordLoaded: false,
      createKeyword: false,
      closeButtonK: true,
      closeButtonT: true,
      createTrail: false,
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
            icons: result,
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

    console.log(`Fetching submemory from ${ENDPOINT_API}/submemory/`);
    fetch(ENDPOINT_API + '/submemory')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! submemory = ', result);
          this.setState({
            submemories: result,
            submemoryLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading submemory',
            error
          );
          // TODO maybe display an error for the user?
        }
      );

    console.log(`Fetching keyword from ${ENDPOINT_API}/keyword/`);
    fetch(ENDPOINT_API + '/keyword')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! keyword = ', result);
          this.setState({
            keywords: result,
            keywordLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading keyword',
            error
          );
          // TODO maybe display an error for the user?
        }
      );
  }

  getValue = (stateKey, event) => {
    let value = event.target.value
    console.log()
    console.log(value)
    this.setState({ [stateKey]: value })
  }

  closeButtonK = () => {
    this.setState({ closeButtonK: false })
  }

  closeButtonT = () => {
    this.setState({ closeButtonT: false })
  }

  addElements = (stateKey) => {
    console.log(stateKey)
    this.setState({ [stateKey]: true })
    if(stateKey === "createKeyword") this.closeButtonK()
    if(stateKey === "createTrail") this.closeButtonT()
  }

  displayDoc = (format) => {
    switch (format) {
      case 'texte':
        return (
          <div>
            <label>Quel est votre texte ? :</label>
            <textarea name='textArea' rows='15' cols='70'></textarea>
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
            <label>Ajouter une image au souvenir :</label>
            <input type='file' name='blobcontain' />
          </div>
        );
    }
  };

  postRequest(name, description, format, date, icon_id) {
    if (name === '' || description === '' || date === '') {
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
    let icons = this.state.icons;
    let submemories = this.state.submemories;
    let keywords = this.state.keywords;
    return (
      //****************************Formulaire d'ajout de souvenir**************************************** */
      <div className="mainContainer">
        <form className='adminForm'>

          {/* *************************************************************** AJOUT DU SOUVENIR *************************************************************** */}
          {/* <MemoryForm 
            onChange={this.getValue}
            name={this.state.name}
            description={this.state.description}
            format={this.state.format}
            date={this.state.date}
            icon_id={this.state.icon_id}
            target_id={this.state.target_id}
            contributeur={this.state.contributeur}
            icons={this.state.icons}
            submemories={this.state.submemories}

          /> */}
          <div className="sousForm">
            <label>Titre du souvenir <abbr> * </abbr></label>
            <input
              required
              className="require"
              value={this.state.name}
              type='text'
              placeholder='Chute du mur'
              onChange={(e) => this.getValue("name", e)}
            />
            <label>Description <abbr> * </abbr></label>
            <textarea required className="require" name="description" row="3" cols="33" placeholder='ex : mur de Berlin' maxlength="95" onChange={(e) => this.getValue("description", e)}></textarea>
            <label>Format du fichier <abbr> * </abbr></label>
            <select required className="require" name='format' id='format_id' onChange={(e) => this.getValue("format", e)}>
              <option value='image'>Image</option>
              <option value='video'>Vidéo</option>
              <option value='youtube'>Lien Youtube</option>
              <option value='texte'>Texte</option>
            </select>
            {
              this.displayDoc(this.state.format)
            }
            <label>Date de contribution <abbr> * </abbr></label>
            <input required className="require" type='date' onChange={(e) => this.getValue("date", e)} />
            <label>Contributeurs (séparer les noms par des virgules) </label>
            <input
              type='text'
              placeholder='Jean Dupont'
              onChange={(e) => this.getValue("contributeur", e)}
            />
            <label>Icone de souvenir </label>
            <select name='icons' id='icon_id' onChange={(e) => this.getValue("icon_id", e)}>
              {icons.map((icon) => {
                return (
                  <option key={icon.id} value={icon.id}>
                    {icon.name}
                  </option>
                );
              })}
            </select>
            <label>À quel souvenir est-il relié ? (peut être indépendant) </label>
            <select name='target' id='target_id' onChange={(e) => this.getValue("target_id", e)}>
              {submemories.map((submemory) => {
                return (
                  <option key={submemory.id} value={submemory.id}>
                    {submemory.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* *************************************************************** AJOUT KEYWORDS *************************************************************** */}

          <div className="sousForm keywords" id="KeyWords">
            <div className="divKeywords">
              <label>
                Taguer le souvenir d'un ou plusieurs mots-clés
          </label>
              <select name='keywords' id='keyword_id' onChange={(e) => this.getValue("keyword_id", e)}>
                {keywords.map((keyword) => {
                  return (
                    <option key={keyword.id} value={keyword.id}>
                      {keyword.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {
              this.state.closeButtonK &&
                <button type="button" onClick={() => this.addElements('createKeyword')} >Ajouter un mot-clé</button>
            }
            {
              this.state.createKeyword &&
              <div className="divKeywords">
                <label>Nouveau mot-clé</label>
                <input
                  value={this.state.keyword}
                  type='text'
                  placeholder='bicentenaire'
                  onChange={(e) => this.getValue("keyword", e)}
                />
                <button type="button">Ajouter ce mot clé à la liste</button>
              </div>
            }
          </div>
          {/* *************************************************************** AJOUT PARCOURS *************************************************************** */}

          <div className="sousForm">
            <label>
              Choix du parcours (un souvenir peut en avoir 0 ou plusieurs)
          </label>
            {this.props.trails.map((trail) => {
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
            })
            }
            {
              this.state.closeButtonT &&
                <button type="button" onClick={() => this.addElements('createTrail')} >Créer un parcours</button>
            }
            {
              this.state.createTrail &&
              <div className="newTrail">
                <label>Créer un nouveau parcours</label>
                <input
                  value={this.state.newTrailName}
                  type='text'
                  placeholder='Ruines'
                  onChange={(e) => this.getValue("newTrailName", e)}
                />
                <button type="button">Ajouter ce parcours au souvenir</button>
              </div>
            }
          </div>

          {/* *************************************************************** AJOUT SUBMEMORY *************************************************************** */}

          <div className="sousForm">
            <label>Ajouter un document au souvenir</label>
            <label>Format du fichier <abbr> * </abbr></label>
            <select required className="require" name='subFormat' id='subFormat_id' onChange={(e) => this.getValue("subFormat", e)}>
              <option value='image'>Image</option>
              <option value='video'>Vidéo</option>
              <option value='youtube'>Lien Youtube</option>
              <option value='texte'>Texte</option>
            </select>
            {
              this.displayDoc(this.state.subFormat)
            }
          </div>

        </form>
        <button type='button' onClick={() => this.postRequest(name, description, format, date, icon_id)}>
          Créer un souvenir
        </button>
      </div>
    );
  }
}

export default AdminForm;
