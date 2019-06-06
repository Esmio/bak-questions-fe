import React from 'react';

function Footer({ableToSubmit, handleNext}) {
    return (
        <div className="qanda-footer">
            <div 
                className="qanda-button"
                onClick={handleNext}
            >
                {ableToSubmit ? '提交' : '下一步'}
            </div>
        </div>
    )
}

export default Footer;