import { React, Component } from 'react';
import './AdminForm.css';
import { ENDPOINT_API } from './constants/endpoints';

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
    console.log(value);

    /*~~~~~~~~~~ Put Request ~~~~~~~~~*/
    fetch(ENDPOINT_API + '/updatetargetid/' + trail_id, {
      method: 'PUT',
      body: JSON.stringify({ target_id: value }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // const value = '';
        // this.setState({
        //   name: value,
        //   description: value,
        //   format: value,
        //   date: value,
        // });
        alert('Le souvenir a bien été en registré !');
      });
  }

  render() {
    console.log(this.state.trails);
    const trails = this.state.trails;
    const memories = this.state.memories;
    return (
      <div className='mainContainer'>
        <h2>Lier un parcours avec un souvenir</h2>
        <table>
          <tr>
            <th>Parcours</th>
            <th>Souvenirs</th>
          </tr>
          {trails.map((trail) => {
            return (
              <tr>
                <td key={trail.id}>{trail.parcours}</td>
                <td>
                  <select
                    name='memories'
                    onChange={(e) => this.putRequest(trail.id, e)}
                  >
                    <option value='null'>...</option>
                    {memories.map((memory) => {
                      const selected = trail.target_id === memory.id;
                      return (
                        <option
                          key={memory.id}
                          value={memory.id}
                          selected={selected}
                        >
                          {memory.name}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}

export default ManageLink;
