import React from 'react';

const Message = ({ info, show }) => show ?
    (
        <div className="qanda-message">
            {info}
        </div>
    ) : ''

export default Message;