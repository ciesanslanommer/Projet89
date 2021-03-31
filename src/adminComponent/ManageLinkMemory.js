import { React, Component } from 'react';
import { ENDPOINT_API } from '../constants/endpoints';

class ManageLinkMemory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trails: this.props.trails,
      memories: this.props.memories,
      trailByMemory: [],
      loaded: false,
    };
  }
  componentDidMount() {
    console.log(`Fetching trail from ${ENDPOINT_API}/trailbymemory/`);
    fetch(ENDPOINT_API + '/trailbymemory')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log('Success! trail by memory = ', result);
          this.setState({
            trailByMemory: result,
            loaded: true,
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
  }

  getValue = (event) => {
    let value = event.target.value;
    console.log(value);
    this.setState({ target_id: value });
  };

  postRequest(memory_id, event) {
    let first = document.getElementById(memory_id + '-first').value;
    let second = document.getElementById(memory_id + '-second').value;
    console.log(first, second);
    /*~~~~~~~~ Delete Request ~~~~~~~~*/

    fetch(ENDPOINT_API + '/trailsfrommemory/' + memory_id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then(
        /*~~~~~~~~~~ Put Request ~~~~~~~~~*/
        fetch(ENDPOINT_API + '/hastrail', {
          method: 'POST',
          body: JSON.stringify({
            memory_id: Number(memory_id),
            trail_id: Number(first),
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'x-access-token' : this.props.token,
          },
        })
          .then((res) => res.json())
          .then(
            /*~~~~~~~~~~ Put Request ~~~~~~~~~*/
            fetch(ENDPOINT_API + '/hastrail', {
              method: 'POST',
              body: JSON.stringify({
                memory_id: Number(memory_id),
                trail_id: Number(second),
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-access-token' : this.props.token,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
                alert('Le parcours a bien été en registré !');
                this.componentDidMount();
              })
          )
      );
  }

  render() {
    console.log(this.state.trails);
    const trails = this.state.trails;
    const memories = this.state.memories;
    const loaded = this.state.loaded;
    const trailByMemory = this.state.trailByMemory;

    return (
      <div className='mainContainer'>
        <h2>Lier un souvenir à un parcours</h2>
        {loaded && (
          <table>
            <thead>
              <tr>
                <th>Souvenirs</th>
                <th>Parcours 1</th>
                <th>Parcours 2</th>
              </tr>
            </thead>
            <tbody>
              {memories.map((memory) => {
                const memId = memory.id;
                let first, second;
                if (trailByMemory[memId]) {
                  if (trailByMemory[memId][0]) first = trailByMemory[memId][0];
                  if (trailByMemory[memId][1]) second = trailByMemory[memId][1];
                }

                return (
                  <tr key={memId}>
                    <td key={memId}>{memory.name}</td>

                    {/* Trail 1  */}
                    <td>
                      <select
                        id={memId + '-first'}
                        onChange={(e) => this.postRequest(memId, e)}
                        value={first !== undefined ? first.id : 'null'}
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

                    {/* Trail 2 */}
                    <td>
                      <select
                        id={memId + '-second'}
                        onChange={(e) => this.postRequest(memId, e)}
                        value={second !== undefined ? second.id : 'null'}
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
        )}
      </div>
    );
  }
}

export default ManageLinkMemory;
