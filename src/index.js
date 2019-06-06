import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import App2 from './App2';
import Qanda from './Qanda';
import * as serviceWorker from './serviceWorker';
import queryString from 'query-string';

const parsed = queryString.parse(window.location.search);

let Node = App2;
if(parsed && parsed.issue_type === '2') Node = Qanda;

ReactDOM.render(<Node />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
