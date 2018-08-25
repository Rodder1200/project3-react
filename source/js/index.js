import React from 'react';
import ReactDOM from 'react-dom';
import Contacts from './contacts.js';
import Services from './services.js';


if (document.getElementById('cont')) {
    ReactDOM.render(
    <Contacts/>,
    document.getElementById('cont')
    );
}


if (document.getElementById('serv')) {
    ReactDOM.render(
      <Services/>,
      document.getElementById('serv')
    );
}