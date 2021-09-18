// https://css-tricks.com/hamburger-menu-with-a-side-of-react-hooks-and-styled-components/
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom'
import './Menu.css';

const classNames = require('classnames');

function Menu(props) {
  const [ open, setOpen ] = useState(false);

  const onClickOnItem = (event, item) => {
    event.preventDefault();
    setOpen(false);
    props.onClick(item);
  }

  const goToAdmin = (event) => {
    event.preventDefault();
    props.history.push("/admin");
  }

  return (
    <>
      <button
        id="burger-button"
        className={classNames(open ? 'menu-open' : 'menu-close')}
        onClick={() => setOpen(!open)}
      >
        <div />
        <div />
        <div />
      </button>

      <div
        id="menu"
        className={classNames(open ? 'menu-open' : 'menu-close')}
      >
        <a href="/" onClick={e => onClickOnItem(e, 'aide')}>Aide</a>
        <a href="/" onClick={e => onClickOnItem(e, 'projet89')}>Projet 89</a>
        <a href="/" onClick={e => onClickOnItem(e, 'collecte')}>La collecte</a>
        {
          props.showAdmin && <a href="/" onClick={goToAdmin}>ADMIN</a>
        }
      </div>
    </>
  );
}
export default withRouter(Menu);
