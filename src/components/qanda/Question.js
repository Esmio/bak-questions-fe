import React from 'react';

function Question({ required, number, title, children, multi, hint, showHint }) {
    let titleExtra = '';
    if(typeof multi === 'boolean') titleExtra = '【多选题】';
    if(typeof multi === 'number') titleExtra = `【最多选择${multi}项】`;
    return (
        <div
          style={{
            width: 'calc(100vw - .6rem)',
            // padding: '.3rem 0',
            borderBottom: '.01rem solid #f2f2f2',
            backgroundColor: 'white',
            borderRadius: '.1rem',
            marginBottom: '.2rem',
          }}
        >
            <div
                style={{
                display: 'flex',
                alignItems: 'flex-start',
                fontWeight: 'border',
                minHeight: '.7rem',
                lineHeight: '.5rem',
                borderBottom: '.01rem solid #efefef',
                padding: '.1rem .2rem',
                boxSizing: 'border-box',
                color: required && showHint ? 'red' : '',
                }}
            >
                <span
                    style={{
                        width: '.4rem',
                    }}
                >
                    { !!number ? `${number}.` : '' }
                </span>
                <span>
                    {title}
                    <span
                        style={{
                            color: '#19a8ee',
                        }}
                    >
                        {!!multi ? titleExtra : ''}
                    </span>
                </span>
            </div>
            <div
                style={{
                    color: 'red',
                    fontSize: '.18rem',
                    paddingLeft: '.6rem',
                }}
            >
                {/* {required && showHint ? hint : ''} */}
            </div>
            <div
                style={{
                // paddingLeft: '.6rem',
                // paddingTop: '.2rem',
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default Question;