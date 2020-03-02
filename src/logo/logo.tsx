import React from 'react';
import logo from './logo.png'

export function Logo() {
    return (<img
        src={logo}
        height="30"
        className="d-inline-block align-top"
        alt="logo"
    />);
}