import { React, Component } from 'react';
import AddKeyword from './AddKeyword.js';

import { ENDPOINT_API } from '../constants/endpoints';

const classNames = require('classnames');

class MemoryForm extends Component {
  constructor(props) {
    super(props);
    let state = {
      name: '',
      description: '',
      format: 'image',
      content: null,
      caption: '',
      icon_id: '',
      target_id: [],
      contribution_date: '',
      contributeur: '',
      priority: '1',
      keyword_id: '',
      subFormat: 'image',
      memories: [],
      memoriesLoaded: false,
      checkedTrails: [],
      checkedKeywords: [],
      trails: [],
      trailsLoaded: false,
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
      addSub: false,
      addKeyword: false,
      update: false,
      id: 0,
    };
    if (this.props.memory) {
      state = Object.assign(state, this.props.memory, {
        update: true,
      });
    }
    this.state = state;
  }
  componentDidMount() {
    // TODO display a loader when not loaded yet?
    //console.log(`Fetching souvenirs from ${ENDPOINT_API}/icon/`);
    fetch(ENDPOINT_API + '/icon')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading icon: ", res.statusText);
          alert("Error loading icon");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          //console.log('Success! icon = ', result);
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

    //console.log(`Fetching memory from ${ENDPOINT_API}/memories/`);
    fetch(ENDPOINT_API + '/memories')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading memories: ", res.statusText);
          alert("Error loading memories");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          console.log('Success! MemotyForm submemory = ', result);
          this.setState({
            memories: [...result],
            memoriesLoaded: true,
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
    this.loadTrail();
    this.loadKeyword();
  }

  loadKeyword = () => {
    this.setState({ keywordLoaded: false });
    //console.log(`Fetching keyword from ${ENDPOINT_API}/keyword/`);
    fetch(ENDPOINT_API + '/keyword')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading keywords: ", res.statusText);
          alert("Error loading keywords");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          //console.log('Success! keyword = ', result);
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
  };

  loadTrail = () => {
    this.setState({ trailsLoaded: false });
    //console.log(`Fetching keyword from ${ENDPOINT_API}/trail/`);
    fetch(ENDPOINT_API + '/trail')
      .then((res) => {
        if (!res.ok) {
          console.error("Error loading trails: ", res.statusText);
          alert("Error loading trails");
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(
        (result) => {
          //console.log('Success! trail = ', result);
          this.setState({
            trails: result,
            trailsLoaded: true,
          });
        },
        (error) => {
          console.error(
            'Oops, something wrong happened when loading trail',
            error
          );
          // TODO maybe display an error for the user?
        }
      );
  };

  getValue = (stateKey, event) => {
    let value = event.target.value;
    this.setState({ [stateKey]: value });
  };

  getFile = (e) => {
    if (e.target.files[0]) {
      const fsize = e.target.files[0].size;
      //console.log("fsize", fsize)

      if (Math.round(fsize / 1024) > 5000) {
        alert('File is too large: limit is 5mb');
        this.setState({ content: '' });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.setState({
            content: reader.result,
          });
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  closeButtonK = () => {
    this.setState({ closeButtonK: false });
  };

  closeButtonT = () => {
    this.setState({ closeButtonT: false });
  };

  addElements = (stateKey) => {
    //console.log(stateKey);
    this.setState({ [stateKey]: true });
    if (stateKey === 'createKeyword') this.closeButtonK();
    if (stateKey === 'createTrail') this.closeButtonT();
  };

  isChecked = (stateKey, e) => {
    //console.log(stateKey);
    let isChecked = e.target.checked;
    let id = e.target.id;
    //console.log(isChecked, id);
    let tab = [...this.state[stateKey]];
    if (isChecked) {
      tab.push(Number(id));
      //console.log('Tab trails push : ' + tab);
      this.setState({ [stateKey]: tab });
    } else {
      tab = tab.filter((el) => el !== id);
      //console.log(tab);
      this.setState({ [stateKey]: tab });
    }
    //console.log(this.state[stateKey]);
  };

  createTabTarget = (e) => {
    //console.log(e.target);
    let value = Number(e.target.value);
    let isInState = this.state.target_id.findIndex((el) => el === value);
    //console.log(isInState);
    //console.log('this.state.target_id ' + this.state.target_id);

    if (isInState === -1) {
      const tab = [...this.state.target_id, value];
      this.setState({ target_id: tab });
    } else {
      let tabFilter = this.state.target_id.filter((target) => target !== value);
      //console.log('else' + tabFilter);
      this.setState({ target_id: tabFilter });
    }
  };

  displayDoc = (format) => {
    switch (format) {
      case 'texte':
        return (
          <div>
            <label>Quel est votre texte ? : </label>
            <textarea
              name='textArea'
              rows='15'
              cols='70'
              onChange={(e) => this.getValue('content', e)}
            >
              {this.state.content}
            </textarea>
          </div>
        );
      case 'youtube':
        return (
          <div>
            <label>Ajouter un lien vers la vidéo : </label>
            <input
              type='text'
              name='linkToYoutube'
              placeholder='lien vers la vidéo Youtube'
              value={this.state.content}
              onChange={(e) => this.getValue('content', e)}
            />
          </div>
        );
      default:
        return (
          <div>
            <label>
              { format === 'audio' ? 'Ajouter un fichier son' : 'Ajouter une image' } :
            </label>
            <input
              type='file'
              name='blobcontain'
              accept={
                format === 'audio'
                  ? '.mp3, .wav, .ogg'
                  : '.jpeg, .png, .jpg'
              }
              onChange={(e) => this.getFile(e)}
            />
          </div>
        );
    }
  };

  openDiv = (stateKey, e) => {
    this.setState({ [stateKey]: true });
  };

  closeDiv = (stateKey, e) => {
    this.setState({ [stateKey]: false });
  };

  postRequest(request) {
    if (
      request.name === '' ||
      request.description === '' ||
      request.content === ''
    ) {
      alert('Des champs obligatoires ne sont pas remplis');
      return;
    }

    var result = new Date(request.contribution_date);
    result.setDate(result.getDate() + 1);
    request.contribution_date = result;

    if (request.format === 'youtube') request.youtube = request.content;

    /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
    fetch(ENDPOINT_API + '/memory', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'x-access-token' : this.props.token,
      },
    })
      .then(function(res) {
        if (!res.ok) {
          res.json().then(s => alert('Erreur : ' + s.message));
          throw res;
        }
        return res.json();
      })
      .then((res) => {
        //console.log(res);
        // const value = '';
        // this.setState({
        //   name: value,
        //   description: value,
        //   format: value,
        //   date: value,
        // });
        alert('Votre souvenir a bien été enregistré :)');
        this.componentDidMount();
      }).catch(e => console.error(e));
  }

  updateRequest(request) {
    if (
      request.name === '' ||
      request.description === '' ||
      request.content === ''
    ) {
      alert('Des champs obligatoires ne sont pas remplis');
      return;
    }

    var result = new Date(request.contribution_date);
    result.setDate(result.getDate() + 1);
    request.contribution_date = result;

    if (request.format === 'youtube') request.youtube = request.content;

    //console.log('update to do');
    //console.log(request);

    /*~~~~~~~~~~ Post Request ~~~~~~~~~*/
    fetch(ENDPOINT_API + '/memory/' + this.state.id, {
      method: 'PUT',
      body: JSON.stringify(request),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'x-access-token' : this.props.token,
      },
    })
      .then(function(res) {
        if (!res.ok) {
          res.json().then(s => alert('Erreur : ' + s.message));
          throw res;
        }
        return res.json();
      })
      .then((res) => {
        //console.log(res);
        // const value = '';
        // this.setState({
        //   name: value,
        //   description: value,
        //   format: value,
        //   date: value,
        // });
        alert('Votre souvenir a bien été modifié :)');
        this.componentDidMount();
      }).catch(e => console.error(e));
  }

  render() {
    const request = {
      name: this.state.name,
      description: this.state.description,
      format: this.state.format,
      content: this.state.content,
      caption: this.state.caption,
      icon_id: this.state.icon_id,
      contributeur: this.state.contributeur,
      contribution_date: this.state.contribution_date,
      priority: this.state.priority,
      trails: this.state.checkedTrails,
      keywords: this.state.checkedKeywords,
      targets_id: this.state.target_id,
      subs: [],
    };

    // //console.log(request);
    let icons = this.state.icons;
    let keywords = this.state.keywords;
    const date = this.state.contribution_date
      ? this.state.contribution_date.slice(0, 10)
      : '';

    return (
      //****************************Formulaire d'ajout de souvenir**************************************** */
      <div className='mainContainer'>
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
          <h2>Créer un souvenir</h2>
          <div className='sousForm'>
            <label>
              Titre du souvenir <abbr> * </abbr>
            </label>
            <input
              required
              className='require'
              value={this.state.name}
              type='text'
              placeholder='Chute du mur'
              onChange={(e) => this.getValue('name', e)}
            />
            <label>
              Description <abbr> * </abbr>
            </label>
            <textarea
              required
              className='require'
              name='description'
              row='3'
              cols='33'
              placeholder='ex : mur de Berlin'
              maxLength='95'
              onChange={(e) => this.getValue('description', e)}
            >
              {this.state.description}
            </textarea>
            <label>
              Format du fichier <abbr> * </abbr>
            </label>
            <select
              required
              className='require'
              name='format'
              id='format_id'
              value={this.state.format}
              onChange={(e) => this.getValue('format', e)}
            >
              <option value='image'>Image</option>
              <option value='youtube'>Vidéo</option>
              <option value='texte'>Texte</option>
              <option value='audio'>Audio</option>
            </select>
            {this.displayDoc(this.state.format)}

            <label>
              Légende (facultatif)
            </label>
            <textarea
              name='caption'
              rows='15'
              cols='70'
              onChange={(e) => this.getValue('caption', e)}
            >
              {this.state.caption}
            </textarea>

            <label>
              Date de contribution <abbr> * </abbr>
            </label>
            <input
              required
              className='require'
              type='date'
              onChange={(e) => this.getValue('contribution_date', e)}
              value={date.slice(0, 10)}
            />
            <label>Contributeurs (séparer les noms par des virgules) </label>
            <input
              type='text'
              placeholder='Jean Dupont'
              onChange={(e) => this.getValue('contributeur', e)}
              value={this.state.contributeur}
            />

            <label>Icône de souvenir </label>
            
            <div>
              {
                icons.map((icon) => <img
                  className={classNames('admin-icon', 'admin-icon-node', { 'selected': icon.id === this.state.icon_id })}
                  src={require('../assets/' + icon.path).default}
                  alt='icon'
                  title={icon.name}
                  onClick={e => this.setState({ icon_id: icon.id })}
                />)
             }
           </div>
           {
            typeof this.state.icon_id === 'number' && `Vous avez choisi l'icone ${icons.filter(e => e.id === this.state.icon_id).map(e => e.name)}.`
           }
            {

              // <select
              //   name='icons'
              //   id='icon_id'
              //   value={this.state.icon_id}
              //   onChange={(e) => this.getValue('icon_id', e)}
              // >
              //   {icons.map((icon) => {
              //     return (
              //       <option key={icon.id} value={icon.id}>
              //         {icon.name}
              //       </option>
              //     );
              //   })}
              // </select>
            }


            {/* <label>
              Ordre d'apparence <abbr> * </abbr>
            </label>
            <select
              required
              className='require'
              name='priority'
              id='priority_id'
              value={this.state.priority}
              onChange={(e) => this.getValue('priority', e)}
            >
              <option value='1'>Premier</option>
              <option value='2'>Deuxième</option>
              <option value='3'>Troisième</option>
            </select>
            <label>
              À quel souvenir est-il relié ? (peut être indépendant)
            </label>
            <select
              name='target'
              id='target_id'
              onClick={this.createTabTarget}
              multiple
            >
              {this.state.memories.map((memory) => {
                return (
                  <option key={memory.id} value={memory.id}>
                    {memory.name}
                  </option>
                );
              })}
            </select>
            <p>Le souvenir est relié à </p>
            <div>
              {this.state.target_id.map((target) => {
                let tabFilter = this.state.memories.filter(
                  (el) => el.id === target
                );
                return (
                  <p key={target.id}>
                    {tabFilter[0].name}
                    <p className='comma'>,</p>{' '}
                  </p>
                );
              })}
            </div> */}
          </div>

          {/* *************************************************************** AJOUT PARCOURS *************************************************************** */}
          {/* <h2>Choix du parcours</h2>
          <div className='sousForm'>
            <label>
              Choix du parcours (un souvenir peut en avoir 0 ou plusieurs)
            </label>
            {this.state.trails.map((trail) => {
              return (
                <div key={trail.id}>
                  <input
                    type='checkbox'
                    id={trail.id}
                    name={trail.parcours}
                    value={trail.parcours}
                    onChange={(e) => this.isChecked('checkedTrails', e)}
                  />
                  <label htmlFor={trail.id}>{trail.parcours}</label>
                </div>
              );
            })}
          </div> */}
         

        {
          
                  // <h2>Autres fonctionnalités</h2>
        }
         

          {/* *************************************************************** AJOUT KEYWORDS *************************************************************** */}
          {
           /* <button
              type='button'
              onClick={
                this.state.addKeyword
                  ? (e) => this.closeDiv('addKeyword')
                  : (e) => this.openDiv('addKeyword')
              }
            >
              Ajouter un mot clé
            </button>*/
          }
          {
          /*  this.state.addKeyword && (
            <div className='sousForm keywords' id='KeyWords'>
              <div className='divKeywords'>
                <label>Taguer le souvenir d'un ou plusieurs mots-clés</label>
                {keywords.map((keyword) => {
                  return (
                    <div>
                      <input
                        type='checkbox'
                        id={keyword.id}
                        key={keyword.id}
                        name={keyword.word}
                        value={keyword.word}
                        onChange={(e) => this.isChecked('checkedKeywords', e)}
                      />
                      <label for={keyword.id}>{keyword.word}</label>
                    </div>
                  );
                })}
              </div>
              {
                this.state.closeButtonK && (
                  <button
                    type='button'
                    onClick={() => this.addElements('createKeyword')}
                  >
                    Ajouter un mot-clé
                  </button>
                )
              }
              {this.state.createKeyword && (
                <AddKeyword reloadKeyword={this.loadKeyword} token={this.props.token} />
              )}
            </div>
          )*/
        }

          {/* *************************************************************** AJOUT SUBMEMORY *************************************************************** */}
          
          {
            /*<button
              type='button'
              onClick={
                this.state.addSub
                  ? (e) => this.closeDiv('addSub')
                  : (e) => this.openDiv('addSub')
              }
            >
              Ajouter un sous-souvenir
            </button>


            {this.state.addSub && (
              <div className='sousForm'>
                <label>Ajouter un document au souvenir</label>
                <label>
                  Format du fichier <abbr> * </abbr>
                </label>
                <select
                  required
                  className='require'
                  name='subFormat'
                  id='subFormat_id'
                  onChange={(e) => this.getValue('subFormat', e)}
                >
                  <option value='image'>Image</option>
                  <option value='youtube'>Vidéo</option>
                  <option value='texte'>Texte</option>
                  <option value='audio'>Audio</option>
                </select>
                {this.displayDoc(this.state.subFormat)}
              </div>
            )}*/

          }
        </form>
        <button
          type='button'
          onClick={
            this.state.update
              ? () => this.updateRequest(request)
              : () => this.postRequest(request)
          }
        >
          <h3>
            {this.state.update
              ? 'Mettre a jour le souvenir'
              : 'Créer un souvenir'}
          </h3>
        </button>
      </div>
    );
  }
}

export default MemoryForm;
