import {Component} from 'react'
import {CenterButton, DocumentButton, ExitButton} from './Document'
import './TrailMessage.css'

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
        while(this.props.entries[randomIndex].parcours === this.props.trail.parcours) {
            randomIndex = this.getRandomInt(this.props.entries.length);
        }
        return this.props.entries[randomIndex].id;
    }

    render() {
    
        return (
            <div className='message'>
                <h2>FIN DU PARCOURS {this.props.trail.parcours.toUpperCase()}</h2>
                <p>Vous êtes à la fin du parcours « {this.props.trail.parcours} ».
                <br/><br/>Comment souhaitez-vous poursuivre votre navigation dans l’année 1989 ?
                </p>
                <div className='exitButtons'>
  
                    <div className='docbuttons'>
                        <ExitButton 
                            type='previous' 
                            onClick={() => this.props.onNextClick(this.props.id, 'memory')}
                            displayArrowText={this.props.displayArrowText}
                            nature="memory"
                            parcours={this.props.trail}
                        />
                        <CenterButton trailImg={this.props.trail.path} />
                    </div>
                    {this.props.arrowText}
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

class Entry extends Component {
    render() {
        const { id, key, onClick, parcours, currentId, currentTrail, trailImg } = this.props;
        return (
            <div className='message'>
                <h2>PARCOURS {currentTrail.parcours.toUpperCase()}</h2>
                <p>Message d'entrée</p>
                <div className="entryButtons">
                    <div className='docbuttons'>
                        <DocumentButton
                            id={id}
                            key={key}
                            onClick={onClick}
                            type='next'
                            parcours={parcours}
                            currentId={currentId}
                            currentTrail={currentTrail}
                            nature="memory"
                            displayArrowText={this.props.displayArrowText}
                        />
                        <CenterButton trailImg={trailImg} />
                    </div>
                    {this.props.arrowText}
                </div>
            </div>
        );
    }
}

class TrailMessage extends Component {
    
  getFirstMemoryIdFromEntries() {
    let id = -1;
    let parcours;
    let path;
    for(let i=0; i<this.props.entries.length; i++) {
      if(this.props.entries[i].id === this.props.id) {
        id = this.props.entries[i].target_id;
        parcours = this.props.entries[i].parcours;
        path = this.props.entries[i].path;
      }
    }
    return {id: id, parcours: parcours, path: path};
  }

    display(state) {
        switch (state) {
            case 'entry':
                return (
                    <Entry 
                        id={this.getFirstMemoryIdFromEntries().id}
                        key={this.getFirstMemoryIdFromEntries().id}
                        onClick={() => this.props.onNextClick(this.getFirstMemoryIdFromEntries().id, 'memory')}
                        parcours={this.getFirstMemoryIdFromEntries()}
                        currentId={this.props.id}
                        currentTrail={this.props.trail}
                        trailImg={this.props.trail.path}
                        displayArrowText={this.props.displayArrowText}
                        arrowText={this.props.arrowText}
                    />
                )
            case 'exit':
                return (
                <Exit 
                    onNextClick={this.props.onNextClick} 
                    trail={this.props.trail} 
                    id={this.props.id} 
                    closeDoc={this.props.closeDoc} 
                    entries={this.props.entries}
                    displayArrowText={this.props.displayArrowText}
                    arrowText={this.props.arrowText}
                />)
            default:
                return <div>Erreur</div>
        }
    }
    render() {
        console.log(this.props.trail.parcours)
        return (
            this.display(this.props.state)
        )
    }
}

export default TrailMessage;