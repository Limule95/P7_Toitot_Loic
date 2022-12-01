import React from "react";
import Log from "../Log";
import logo from "../../assets/MASTERmanga.png";

const Profil = () => {
  return (
    <div className="profil-page">
      
      <img
        src={logo}
        alt="logo Groupomania"
        className="profil-page__logo-site"
      />

      <div className="profil-page__log-container">
        {/* On donne des proprieter "props" aux formulaire afin de s'avoir le quel des deux formulaire s'affichera en premier */}
        <Log signin={false} signup={true} />
      </div>
    </div>
  );
};

export default Profil;
