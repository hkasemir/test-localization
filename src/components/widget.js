import React from 'react';
import './widget.css';


export default function Widget({category, description, picture, pictureAlt}) {
  return (
    <article className='widget-container'>
      <h3>{category}</h3>
      <p>{description}</p>
      <img src={picture} alt={pictureAlt} className='widget-image' />
    </article>
  )
}
