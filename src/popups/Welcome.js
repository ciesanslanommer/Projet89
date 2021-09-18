import Popup from './Popup';

const Welcome = (props) => {
  return (
    <Popup {...props}>
        <h2>Bienvenue.</h2>

        <p>
          Vous voici sur le seuil d’une expérience de navigation dans l’année 1989 proposée par la Compagnie Sans la nommer. Derrière cette fenêtre, on distingue déjà la cartographie des souvenirs de 1989 collectés par la compagnie au fil de la création de son spectacle <i>Projet 89</i>.
        </p>

        <p>
          Consultez les souvenirs en arpentant la cartographie et cheminez à l’intérieur des différents parcours à votre disposition.
        </p>

        <p>
          Variez l’échelle de la carte en utilisant le drag situé à gauche de l’écran et la fonction zoom.
        </p>

        <p>
          Bonne navigation.
        </p>
    </Popup>
  );
};

export default Welcome;
