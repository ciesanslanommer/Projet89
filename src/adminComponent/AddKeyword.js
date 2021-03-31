import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class AddKeyword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
    };
  }

  getValue = (stateKey, event) => {
    let value = event.target.value;
    console.log();
    console.log(value);
    this.setState({ [stateKey]: value });
  };

  postKeyword = () => {
    if (this.state.keyword === '') {
      alert(' le mot clef ne peut pas être vide');
      return;
    }
    fetch(ENDPOINT_API + '/keyword', {
      method: 'POST',
      body: JSON.stringify({
        word: this.state.keyword,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'x-access-token' : this.props.token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const value = '';
        this.setState({
          keyword: value,
        });
        this.props.reloadKeyword();
        alert('mot clef ajouté');
      });
  };

  render() {
    return (
      <div className='divKeywords'>
        <label>Nouveau mot-clé</label>
        <input
          value={this.state.keyword}
          type='text'
          placeholder='bicentenaire'
          onChange={(e) => this.getValue('keyword', e)}
        />
        <button type='button' onClick={this.postKeyword}>
          Ajouter ce mot clé à la liste
        </button>
      </div>
    );
  }
}

export default AddKeyword;
