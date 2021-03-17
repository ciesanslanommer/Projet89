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
                <h2>FIN DU PARCOURS {this.props.trail.toUpperCase()}</h2>
                <p>Vous êtes à la fin du parcours « {this.props.trail} ».
                <br/><br/>Comment souhaitez-vous poursuivre votre navigation dans l’année 1989 ?
                </p>
                <div className='exitButtons'>
                    <div className='docbuttons'>
                        <LastMemoryButton onClick={() => this.props.onNextClick(this.props.id, 'memory')} />
                        <CenterButton trailImg={this.props.trail} />
                    </div>
                    <div className='exitChoices'>
                        <ExitChoice name='REVENIR' subname='à la carte' onClick={this.props.closeDoc} />
                        <ExitChoice name='EMPRUNTER' subname='un nouveau parcours' onClick={() => this.props.onNextClick(this.randomTrailId(), 'entry')} />
                    </div>
                </div>
                <p>Utilisez les boutons et les flèches directionnelles pour vous orientez</p>
                
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