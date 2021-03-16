import {Component} from 'react'
import Document, {CenterButton} from './Document'
import './TrailMessage.css'
import Arrow from './assets/arrow.png'
 
function LastMemoryButton(props) {
    return (
        <div onClick={props.onClick} className="button-current previous">
            <img className='arrowbutton_img' alt='previous' src={Arrow} />
        </div>
    )
}

const ExitChoice = (props) => {
    return (
        <div className='exitChoice' onClick={props.onClick}>
            <p className='button_name'>{props.name}</p>
            <p className='button_subname'>{props.subname}</p>
        </div>
    )
}

class Exit extends Component {
    /* return random int from 0 to max */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    randomTrailId() {
        let randomIndex = this.getRandomInt(this.props.entries.length);
        while(this.props.entries[randomIndex].parcours === this.props.trail) {
            randomIndex = this.getRandomInt(this.props.entries.length);
        }
        return this.props.entries[randomIndex].id;
    }

    render() {
    
        return (
            <div className='message'>
                <h2>{`FIN DU PARCOURS ${this.props.trail.toUpperCase()}`}</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tristique aliquam orci ut luctus. Sed rutrum, lorem ac consequat fringilla, nibh urna placerat enim, id sodales ligula nibh in eros. Donec sagittis scelerisque augue nec pharetra.</p>
                <div className='exitButtons'>
                    <div className='docbuttons'>
                        <LastMemoryButton onClick={() => this.props.onNextClick(this.props.id, 'memory')} />
                        <CenterButton trailImg={this.props.trail} />
                    </div>
                    <div className='exitChoices'>
                        <ExitChoice name='RETOURNER' subname='à la carte' onClick={this.props.closeDoc} />
                        <ExitChoice name='DECOUVRIR' subname='un nouveau parcours' onClick={() => this.props.onNextClick(this.randomTrailId(), 'entry')} />
                    </div>
                </div>
                
            </div>
        )
    }
}

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
                return (
                <Exit 
                    onNextClick={this.props.onNextClick} 
                    trail={this.props.trail} 
                    id={this.props.id} 
                    closeDoc={this.props.closeDoc} 
                    entries={this.props.entries}
                />)
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