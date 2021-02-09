import { React, Component } from 'react';
import './AdminForm.css';
import { ENDPOINT_API } from './constants/endpoints';

class ManageLinkMemory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trails: this.props.trails,
      memories: this.props.memories,
    };
  }

  getValue = (event) => {
    let value = event.target.value;
    console.log(value);
    this.setState({ target_id: value });
  };

  postRequest(memory_id, event) {
    let value = event.target.value;
    console.log(value);
    console.log(memory_id);

    /*~~~~~~~~~~ Put Request ~~~~~~~~~*/
    fetch(ENDPOINT_API + '/hastrail', {
      method: 'POST',
      body: JSON.stringify({
        memory_id: Number(memory_id),
        trail_id: Number(value),
      }),
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
        alert('Le parcours a bien été en registré !');
      });
  }

  render() {
    console.log(this.state.trails);
    const trails = this.state.trails;
    const memories = this.state.memories;
    return (
      <div className='mainContainer'>
        <h2>Lier un souvenir à un parcours</h2>
        <table>
          <thead>
            <tr>
              <th>Souvenirs</th>
              <th>Parcours</th>
            </tr>
          </thead>
          <tbody>
            {memories.map((memory) => {
              return (
                <tr key={memory.id}>
                  <td key={memory.id}>{memory.name}</td>
                  <td>
                    <select
                      name='trails'
                      onChange={(e) => this.postRequest(memory.id, e)}
                    >
                      <option value='null'>...</option>
                      {trails.map((trail) => {
                        return (
                          <option key={trail.id} value={trail.id}>
                            {trail.parcours}
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

export default ManageLinkMemory;
