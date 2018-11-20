import React from 'react';

export default function ConnectionItem({ item, onClick }) {
    return (
        <li onClick={() => onClick(item)}>
            <i className="fas fa-edit"></i>
            <span className="px-2">{item.name}</span>
        </li>
    );
}