import './Welcome.css';

const Welcome = (props) => {
  return (
    <div id='welcome_wrap'>
      <div id='welcome'>
        <h2>Bienvenue !</h2>
        <p>
          Voici la cartographie du Projet 89. La Compagnie sans la nommer vous
          invite à naviguer à travers les souvenirs et les thèmes de cette
          annéee tournant.
        </p>
        <p>Pour naviguer dans la carte, utilisez le drag et le zoom.</p>
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

export default Welcome;
