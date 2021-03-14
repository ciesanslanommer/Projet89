import {Component} from 'react'
import Document from './Document'
import './TrailMessage.css'

class TrailMessage extends Component {
    display(state) {
        switch (state) {
            case 'entry':
                return (
                <div className='message'>
                    <h2>PARCOURS {this.props.trail.toUpperCase()}</h2>
                    <p>Message d'entrée</p>
                </div>
                )
            case 'exit':
                return <div className='message'>Message de fin</div>
            case 'memory':
                return <Document/>
            default:
                return <div>Erreur</div>
        }
    }
    render() {
        console.log(this.props.trail)
        return (
            this.display(this.props.state)
        )
    }
}

export default TrailMessage;