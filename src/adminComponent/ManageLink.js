import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class ManageLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trails: this.props.trails,
      memories: this.props.memories,
    };
  }

  putRequest(trail_id, event) {
    let value = event.target.value;
    //console.log(value);

    /*~~~~~~~~~~ Put Request ~~~~~~~~~*/
    fetch(ENDPOINT_API + '/updatetargetid/' + trail_id, {
      method: 'PUT',
      body: JSON.stringify({ target_id: value }),
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
        alert('Le lien a bien été enregistré :)');
      }).catch(e => console.error(e));
  }

  render() {
    //console.log(this.state.trails);
    const trails = this.state.trails;
    const memories = this.state.memories;
    return (
      <div className='mainContainer'>
        <h2>Lier un parcours avec un souvenir</h2>
        <table>
          <thead>
            <tr>
              <th>Parcours</th>
              <th>Souvenirs</th>
            </tr>
          </thead>
          <tbody>
            {trails.map((trail) => {
              return (
                <tr key={trail.id}>
                  <td key={trail.id}>{trail.parcours}</td>
                  <td>
                    <select
                      name='memories'
                      onChange={(e) => this.putRequest(trail.id, e)}
                      defaultValue={trail.target_id}
                    >
                      <option value='null'>...</option>
                      {memories.map((memory) => {
                        return (
                          <option key={memory.id} value={memory.id}>
                            {memory.name}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ManageLink;
