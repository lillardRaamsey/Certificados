import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import image from '../img/iniciofondo.jpeg';
import "../css/inicio.css"

export default function Inicio() {
  return (
    <div className="fondo">
        <img src={image} alt="Epet20" width={1271.9} height={577}/>
    </div>
  );
}