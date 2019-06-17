import React from 'react';

function Header({tab, total, counter, pageSize}) {
    return (
        <div className="qanda-header">
            <div 
                className="qanda-header-close"
                onClick={() => {window.location.href = "guji://goBack"}}
            >
            </div>
            <div className="qanda-header-counter">
                <span className="qanda-header-counter-number">{window.Math.floor(counter / 60)}</span>
                <span className="qanda-header-counter-time">分钟：</span>
                <span className="qanda-header-counter-number">{counter % 60}</span>
                <span className="qanda-header-counter-time">秒</span>
            </div>
            <div className="qanda-header-process">
                <span style={{color: '#999'}}>{tab * pageSize > total ? total : tab * pageSize}</span>
                <span style={{color: '#222'}}>/{total}</span>
            </div>
        </div>
    )
}

export default Header;