import React from 'react';
import './AlexaRing.css';

export default function AlexaRing({ state }) {
  // state can be 'idle', 'listening', 'processing', 'speaking'
  return (
    <div className={`alexa-container ${state}`}>
      <div className="alexa-ring">
        <div className="ring-gradient"></div>
        <div className="ring-inner"></div>
        
        {/* Generamos ondas dinámicas */}
        <div className="waves">
          <div className="wave w1"></div>
          <div className="wave w2"></div>
          <div className="wave w3"></div>
        </div>
      </div>
      
      {/* Reflejo en la base para dar efecto 3D/dispositivo físico */}
      <div className="alexa-reflection"></div>
    </div>
  );
}
