import './Popup.css';

const Popup = (props) => {
  return (
    <div id='mainpopup_wrap'>
      <div id='mainpopup'>
        {props.children}
        <img
          className='cross'
          src={require('../assets/close.png').default}
          alt='cross'
          onClick={props.onClose}
        />
      </div>
      <div className='darken_background' onClick={props.onClose}></div>
    </div>
  );
};

export default Popup;
