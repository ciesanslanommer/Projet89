import Popup from './Popup';

const Collecte = (props) => {
  return (
    <Popup {...props}>
        <h2>Participer à la collecte</h2>

        <p>
          Pour participer à la collecte de souvenirs de 1989,
          <br />
          envoyez vos textes, images, sons ou dessins à l’adresse :

          <p>
            <b><i>ciesanslanommer@gmail.com</i></b>
          </p>
        </p>
    </Popup>
  );
};

export default Collecte;
