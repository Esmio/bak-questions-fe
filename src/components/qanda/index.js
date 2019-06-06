import React from 'react';
import {useState, useEffect} from 'react';

import './index.scss'

function QandaWrapper({children}) {
    return (
        <div className="qanda-wrapper">
            {children}
        </div>
    )
}

export default QandaWrapper;