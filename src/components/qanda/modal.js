import React, { useState } from 'react';

const Modal = ({ modal, onCancel}) => modal.show ? (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0,0,0, .8)',
            color: '#fff',
            fontSize: '.32rem',
            fontWeight: 'bolder',
            overflow: 'hidden',
            zIndex: 1,
        }}
        onClick={onCancel}
    >
        <span style={{ color: modal.type === 1 ? 'green' : 'red' }}>{modal.info}</span>
        <div
            style={{
                width: '1.6rem',
                height: '.6rem',
                borderRadius: '.05rem',
                backgroundColor: '#fff',
                fontSize: '.28rem',
                color: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '.8rem',
            }}
            onClick={onCancel}
        >
            关闭
        </div>
    </div>
) : ''

export default Modal;