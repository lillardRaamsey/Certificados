import React, { useState, useEffect } from "react";
import "../css/inicio.css";
import { useAuth } from "../context/AuthContex";
import { Link } from "react-router-dom";
import foto1 from "../img/epet20.png";
import foto2 from "../img/certificar2.png"; //imágenes de carrousel
import foto3 from "../img/Certificartexto.jpg";

export default function Inicio() {
  const {user, userData } = useAuth();
  const rol = userData?.cargo;

  const [index, setIndex] = useState(0);
  const images = [foto1, foto2, foto3];

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
          <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Foto ${i+1}`} />
            ))}
          </div>
        </div>
         <div className="arrow left" onClick={prevSlide}>❮</div>
         <div className="arrow right" onClick={nextSlide}>❯</div>
        {user ? (
        <><Link to="/envioCertificado"><div className="button">Certificados</div></Link>
        {rol === "admin" && (<Link to="/admin"><div className="button">ver tabla</div></Link>)}</>
         ) : (
        <><Link to="/ingresar"> <div className="button">Ingresar</div></Link>
        
          <div classname="registrarte">
          <h3> 
            ¿No tenés una cuenta?
            <Link to="/registro"> Registrate</Link>
          </h3>
          
          </div></>
         )
        }
      </div>
    </div>
  );

}
