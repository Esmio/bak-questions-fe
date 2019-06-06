import React from 'react';
import img_selected from './assets/selected.png';
import img_unselected from './assets/unselected.png';

function Radio({ text, value, selected, isOther, onChange, handleOtherValueChange }) {
    return (
        <div
            className="qanda-line"
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                minHeight: '.7rem',
                lineHeight: '.5rem',
                padding: '.1rem .2rem',
                boxSizing: 'border-box',
                borderBottom: '.01rem solid #efefef',
            }}
            onClick={onChange(value)}
        >
            <div
                style={{
                    display: 'flex',
                    width: '.3rem',
                    height: '.5rem',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        height: '.3rem',
                        width: '.3rem',
                        borderRadius: '.15rem',
                        background: `url(${selected ? img_selected : img_unselected}) center center / contain no-repeat`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                </div>
            </div>
            <div
                style={{
                    paddingLeft: '.1rem',
                }}
            >{text}</div>
            {
                isOther ?
                    <div
                        style={{
                            width: '3rem',
                            height: '.37rem',
                            marginLeft: '.2rem',
                            borderBottom: '.01rem solid #ddd',
                        }}
                    >
                        <input
                            style={{
                                border: 'none',
                                outline: 'none',
                                height: '.36rem',
                                width: '3rem',
                                fontSize: '.3rem',
                                padding: '0 .1rem',
                            }}
                            type="text"
                            onChange={(e) => {
                                handleOtherValueChange(e);
                            }}
                        />
                    </div> : ''
            }
        </div>
    )
}

export default Radio;