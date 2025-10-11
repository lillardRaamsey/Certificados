import React, { useState, useEffect } from "react";
import "../css/inicio.css";
import { useAuth } from "../context/AuthContex";
import { Link } from "react-router-dom";
import foto1 from "../img/epet20.png";
import foto2 from "../img/imagenfondo.png"; 
import foto3 from "../img/epet20.png"; //imágenes de carrousel
import FormularioCertificados from './FormularioCertificados'; //esto fué por poner el formulario de certificados en el inicio

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

  const {user}= useAuth();

  return (
    <div className="inicio-container">
      <div className="overlay">
        <h1 className="titulo">Bienvenido a Certific-AR</h1>

        {/* Carrusel */}
        <div className="carousel">
          <div className="arrow left" onClick={prevSlide}>❮</div>
          <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Foto ${i+1}`} />
            ))}
          </div>
          <button className="arrow right" onClick={nextSlide}>❯</button>
        </div>
        {user ? (
        <><Link to="/envioCertificado"><div className="button">Certificados</div></Link></>
         ) : (
        <><Link to="/ingresar"> <div className="button">Ingresar</div></Link>
          <div classname="registrarte"><Link to="/registro">¿No tenés una cuenta? Registrate</Link></div></>
         )
        }
      </div>
    </div>
  );

}
