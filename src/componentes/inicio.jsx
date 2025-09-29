import React, { useState, useEffect } from "react";
import "../css/inicio.css";

import foto1 from "../img/epet20.png";
import foto2 from "../img/imagenfondo.png"; 
import foto3 from "../img/epet20.png"; //imahenes de carrousel

export default function Inicio() {

  const [index, setIndex] = useState(0);
  const images = [foto1, foto2, foto3];

  // Auto-slide (cambia cada 6 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // 6 segundos
    return () => clearInterval(interval);
  }, [images.length]);

  // Funciones para flechas
  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="inicio-container">
      <div className="overlay">
        <h1 className="titulo">Bienvenido a Certific-AR</h1>

        {/* Carrusel */}
        <div className="carousel">
          <button className="arrow left" onClick={prevSlide}>❮</button>
          <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Foto ${i+1}`} />
            ))}
          </div>
          <button className="arrow right" onClick={nextSlide}>❯</button>
        </div>
             <div className="button">
              <a href="/ingresar">Ingresar</a>
        </div>
          <div classname="registrarte">
                  <a href="/registro">¿No tenés una cuenta? Registrate</a>
         </div>
      </div>
    </div>
  );

}