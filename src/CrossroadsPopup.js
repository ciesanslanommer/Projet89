import './CrossroadsPopup.css';

const CrossroadsPopup = (props) => {
  return (
    <div id='popup_wrap'>
      <div className='darken_background'></div>
      <div id='popup'>
        <h2>Vous êtes au croisement de deux parcours.</h2>
        <p>
        Poursuivez votre chemin sur le parcours ou bifurquez sur la nouvelle voie qui s’ouvre devant vous.
        </p>
        <p>
          Quelle direction souhaitez-vous prendre ? Utilisez les flèches directionnelles pour vous orientez.
        </p>
        <img
          className='cross'
          src={require('./assets/close.png').default}
          alt='cross'
          onClick={props.onCrossClick}
        ></img>
      </div>
      
    </div>
  );
};

export default CrossroadsPopup;