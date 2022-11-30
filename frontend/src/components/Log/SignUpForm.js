import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  
  const handleChange = () => {
    setIsAuthor(!isAuthor);
  };


  const handleLogin = (e) => {
    e.preventDefault();
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");
    const pseudoError = document.querySelector(".pseudo.error");
    

    // Toast est une popUp qui s'activera a la création d'un compte pour signifier que le compte a bien était crée
    toast.success("🦄 Compte crée avec SUCCES!!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    <ToastContainer
      position="top-center"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />;

    axios({
      method: "post",
      url: `http://localhost:8000/api/auth/signup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        pseudo,
        firstName,
        lastName,
        email,
        password,
        isAuthor,
      },
    })
      .then((res) => {
        console.log(res);
        document.querySelector("#pseudo").value = null;
        document.querySelector("#email").value = null;
        document.querySelector("#password").value = null;
        <ToastContainer />;
      })
      .catch((res) => {
        if (res.response.data.message.includes("Pseudo invalide")) {
          pseudoError.innerHTML = res.response.data.message;
          emailError.innerHTML = "";
          passwordError.innerHTML = "";
        }
        if (res.response.data.message.includes("Email invalide")) {
          pseudoError.innerHTML = "";
          emailError.innerHTML = res.response.data.message;
          passwordError.innerHTML = "";
        }
        if (res.response.data.message.includes("Password invalide")) {
          emailError.innerHTML = "";
          pseudoError.innerHTML = "";
          passwordError.innerHTML = res.response.data.message;
        }
      });
  };

  return (
    <>
      <ToastContainer />
      <form action="" onSubmit={handleLogin} id="sign-up-form">
        <label htmlFor="pseudo">Pseudo</label>
        <br />
        <input
          type="text"
          name="pseudo"
          id="pseudo"
          onChange={(e) => setPseudo(e.target.value)}
          value={pseudo}
        />
        <div className="pseudo error"></div>
        <br />

          <label htmlFor="firstName">Prénom</label>
        <br />
        <input
          type="text"
          name="firstName"
          id="firstName"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
        <div className="pseudo error"></div>
        <br />

        <label htmlFor="lastName">Nom</label>
        <br />
        <input
          type="text"
          name="lastName"
          id="lastName"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
        <div className="pseudo error"></div>
        <br />

        <label htmlFor="email">Email</label>
        <br />
        <input
          type="text"
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="email error"></div>

        <br />

        <label htmlFor="password">Mot de passe</label>
        <br />
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="password error"></div>
        <br />
        <label htmlFor="isAuthor">Si vous êtes un auteur, cochez cette case :</label>
        <br />
        <input type="checkbox" name="isAuthor" id="isAuthor" checked={isAuthor} onChange={handleChange} 
        value={isAuthor}/>
        <br />
        <br />
        <button type="submit">S'inscrire</button>
      </form>
    </>
  );
};

export default SignUpForm;
