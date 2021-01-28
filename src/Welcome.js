import './Welcome.css';

const Welcome = (props) => {
    return (
        <div id="welcome_wrap">
            <div id='welcome'>
                <h2>Bienvenue !</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                    placerat, metus in facilisis iaculis, magna orci eleifend augue,
                    tincidunt sollicitudin quam quam quis arcu. Etiam facilisis neque id
                    congue blandit. Phasellus in posuere arcu, ac porta nisl. Morbi vel
                    sapien eros. Suspendisse potenti. Nam scelerisque eu tellus ac
                    fermentum. In hac habitasse platea dictumst. Maecenas nisl dui,
                    rhoncus sed nisl eget, malesuada accumsan erat. Maecenas vitae mauris
                    id quam ullamcorper vulputate. Donec euismod ut ligula nec gravida.
                </p>
                <p>Pour naviguer dans la carte, utilisez le drag et le zoom.</p>
                <img
                    className='cross'
                    src={require('./assets/close.png').default}
                    alt='cross'
                    onClick={props.onCrossClick}
                >
                </img>
            </div>
            <div className='darken_background' onClick={props.onCrossClick}></div>
        </div>

    );

};

export default Welcome;
