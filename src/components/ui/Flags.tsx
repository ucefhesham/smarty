import React from 'react';

export const JordanFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 512 256" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#000" d="M0 0h512v85.3H0z" />
    <path fill="#fff" d="M0 85.3h512v85.4H0z" />
    <path fill="#007a3d" d="M0 170.7h512V256H0z" />
    <path fill="#ce1126" d="M0 0l256 128L0 256z" />
    <path fill="#fff" d="M72 128l-8.5 7.4 1.3-11.2-10.7-3.5 11-4-1.8-11.2 8.7 7.2 8.6-7.2-1.7 11.2 11 4-10.7 3.5 1.3 11.2z" />
  </svg>
);

export const USFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 741 390" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#b22234" d="M0 0h741v30H0zM0 60h741v30H0zM0 120h741v30H0zM0 180h741v30H0zM0 240h741v30H0zM0 300h741v30H0zM0 360h741v30H0z"/>
    <path fill="#fff" d="M0 30h741v30H0zM0 90h741v30H0zM0 150h741v30H0zM0 210h741v30H0zM0 270h741v30H0zM0 330h741v30H0z"/>
    <path fill="#3c3b6e" d="M0 0h296.4v210H0z"/>
    <g fill="#fff">
      <g id="s">
        <g id="r">
          <path id="t" d="M24.7 15l1.6 5h5.3l-4.3 3 1.6 5-4.3-3.2-4.2 3.2 1.6-5-4.3-3h5.3z"/>
          <use href="#t" x="49.4"/>
          <use href="#t" x="98.8"/>
          <use href="#t" x="148.2"/>
          <use href="#t" x="197.6"/>
        </g>
        <use href="#r" y="42"/>
        <use href="#r" y="84"/>
        <use href="#r" y="126"/>
        <use href="#r" y="168"/>
      </g>
      <g transform="translate(24.7 21)">
        <g id="r2">
          <use href="#t"/>
          <use href="#t" x="49.4"/>
          <use href="#t" x="98.8"/>
          <use href="#t" x="148.2"/>
        </g>
        <use href="#r2" y="42"/>
        <use href="#r2" y="84"/>
        <use href="#r2" y="126"/>
      </g>
    </g>
  </svg>
);
