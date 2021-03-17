import './CrossroadsPopup.css';

const CrossroadsPopup = (props) => {
  return (
    <div id='popup_wrap'>
      <div id='popup'>
        <h2>Vous entrez dans un carrefour !</h2>
        <p>
          Vous vous trouvez désormais au carrefour de deux parcours. Il est symbolisé par un souvenir, souvenir qui appartient à ces deux parcours. 
          
        </p>
        <p>Grâce aux flèches directionnelles, vous pouvez décider de changer et de découvrir un nouveau parcours ou de continuer votre aventure sur celui-ci.</p>
        <img
          className='cross'
          src={require('./assets/close.png').default}
          alt='cross'
          onClick={props.onCrossClick}
        ></img>
      </div>
      <div className='darken_background' onClick={props.onCrossClick}></div>
    </div>
  );
};

export default CrossroadsPopup;