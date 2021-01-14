import React, {Component} from "react";
import './Nav.css'

//Classe Nav affiche la barre de recherche et récupère la recherche
class Nav extends Component {
    
    navInput  = React.createRef(); //création d'une référence lié à l'input

    state = {
        increment: 0, //Compteur
        searchClass: "search", //permet le changement de classe
        icons: "loupe", //permet le changement d'icône
        request: "" //permet de récupérer la recherche
   };
    
   //Fonction pour l'affichage / animation de la barre de recherche
    displaySearch = (event) => {
       
        this.setState({increment: this.state.increment +1});//on incrémente un compteur
        const verify = this.state.increment %2; //on fait modulo du compteur pour obtenir 0 ou 1
        //pas trouver d'autre solution, boolean ne donctionnait pas
        
        //Condition pour le changement de classe et d'icône
        if(verify === 0){
            this.setState({searchClass: "searchDis", icons: "close"});
            this.navInput.current.value = ""; //on efface la recherche lorsqu'on ferme la barre
        }
        else{
            this.setState({searchClass: "search", icons: "loupe"})
        }
        
    };

    //Fonction collectant l'information de la recherche
    collectInfo = (event) => {
        //Vérification de la touche Entrée
        if (event.key === 'Enter') {
            event.preventDefault(); //evite le rafraichissement de la page

            console.log(this.navInput.current.value);

            const navInfo = this.navInput.current.value; //récupère et stocke la recherche
            console.log(navInfo);
          }
    };

    //Fonction d'affichage de la barre de recherche
    render(desc){
        return (
            <form className = "form" onSubmit={this.collectInfo}>
                <img src={require('./../src/icons/' + this.state.icons + '.png').default} alt={desc} onClick={this.displaySearch}></img> 
                <input ref={this.navInput} onKeyDown={this.collectInfo} className={this.state.searchClass} type="text" placeholder="Recherche" />
            </form>
        )
        
    }
};

export default Nav;