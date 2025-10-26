import React, { useState, useEffect } from "react";
import "../css/inicio.css";
import { useAuth } from "../context/AuthContex";
import { Link } from "react-router-dom";
import foto1 from "../img/certificar2.png";
import foto2 from "../img/Certificartexto.jpg"; //imágenes de carrousel
import foto3 from "../img/epet20.png";
import FormularioCertificados from './FormularioCertificados'; //esto fué por poner el formulario de certificados en el inicio

export default function Inicio() {
  const [index, setIndex] = useState(0);
  const images = [foto1, foto2, foto3];

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
          <div className="arrow right" onClick={nextSlide}>❯</div>
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
