import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/MASTERmanga.png";

const Acceuil = () => {
  // recuperation de l'id et token de la personne connecté
  let userIdLocalStorage = localStorage.getItem("userId");
  let tokenLocalStorage = localStorage.getItem("token");

  // Si il n'y a pas de pseudo ou de token, alors la personne est renvoyer sur la page de connection/inscription "/"
  if (tokenLocalStorage === null && userIdLocalStorage === null) {
    window.location = "/";
  }

  // Recuperation de tous les posts
  const [datas, setDatas] = useState([]);

  // Recuperations des informations de l'user connecté
  const [user, setUser] = useState([]);
  // Raffraichir les données
  const [loading, setLoading] = useState("");
  // Controle l'acces aux modifications ou supression de post
  const [formAcces, setFormAcces] = useState(false);
  // Récupération de l'id du post en fonction des intéractions
  const [modalId, setModalId] = useState("");

  // Recupération des likes de l'utilisateur
  
  // function de récupération de l'id du post et de control d'accès aux modifications des posts
  const toggleFormAcces = (e) => {
    setModalId(e.target.id);
    setFormAcces(!formAcces);
  };

  // requette (GET) getOneUser
  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:8000/api/auth/${userIdLocalStorage}`,
      headers: {
        authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);

  // requette (GET) getAllPost
  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:8000/api/post`,
      headers: {
        authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setDatas(res.data);
        setLoading("chargement");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);

  // Function requete (POST) createPost
  const handlePost = (e) => {
    e.preventDefault();
    let pseudo = user.pseudo;
    let author = user.isAuthor;
    const message = document.querySelector("#message").value;
    let image = document.getElementById("file-create").files[0];
    axios({
      method: "post",
      url: `http://localhost:8000/api/post`,
      headers: {
        authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "multipart/form-data",
      },
      data: {
        pseudo,
        message,
        author,
        image: image,
      },
    })
      .then((res) => {
        setLoading(true);
        document.querySelector("#message").value = null;
        document.getElementById("file-create").value = null;
      })
      .catch((res) => {
        console.log(res);
      });
  };

  // function requette (DELETE) deletePost
  const delPost = (e) => {
    e.preventDefault();
    const id = modalId;
    console.log(id);
    setFormAcces(!formAcces);
    axios({
      method: "delete",
      url: `http://localhost:8000/api/post/${id}`,
      headers: {
        authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(true);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  // function requette (PUT) updatePost
  const updatePost = (e) => {
    e.preventDefault();
    const id = modalId;
    const message = e.target[0].value;
    let image = document.getElementById("file-update").files[0];
    setFormAcces(!formAcces);
    axios({
      method: "put",
      url: `http://localhost:8000/api/post/${id}`,
      headers: {
        authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "multipart/form-data",
      },
      data: {
        message,
        image,
      },
    })
      .then((res) => {
        console.log(res);
        setLoading(true);
      })
      .catch((res) => {
        console.log(res);
      });
  };
  // function requette (PATCH) like
  
  // Function de déconnection
  const logOut = () => {
    localStorage.clear();
    window.location = "/";
  };

  // retour HTML FRONT
  return (
    <>
      <div className="acceuil-page">
        {/* ************************HEADER FINAL************************* */}
        <header>
        <div className="menu">

            <div className="menu__toggle">
                <i className="bx bx-chevron-right"></i>
            </div>

            <div className="menu__logo">
                <img src={logo} alt="logo Groupomania" className="logo-site" />
                <h3>Master manga</h3>
            </div>

            <nav className="menu__nav">
                <div className="menu__nav__title">
                    Management
                </div>

                <ul>
                    <li className="menu__nav__item">
                        <i className="bx bxs-dashboard"></i>
                        <span>Home</span>
                    </li>
                    <li className="menu__nav__item">
                        <i className='bx bxs-wallet'></i>
                        <span>Wallet</span>
                    </li>
                    <li className="menu__nav__item">
                        <i className='bx bxs-basket'></i>
                        <span>Basket</span>
                    </li>
                    <li className="menu__nav__item">
                        <i className='bx bxs-bell'></i>
                        <span>Notifications</span>
                    </li>
                    <li className="menu__nav__item">
                        <i className='bx bxs-user-rectangle'></i>
                        <span>User</span>
                    </li>
                    <li className="menu__nav__item">
                        <i className='bx bx-cog'></i>
                        <span>Settings</span>
                    </li>
                </ul>

            
                <div className="menu__nav__title">
                    Supports
                </div>

                <ul>
                    <li className="menu__nav__item">
                        <i className="bx bxs-help-circle"></i>
                        <span>Get Help</span>
                    </li>
                    <li className="menu__nav__item">
                        <i className='bx bxs-message-dots'></i>
                        <span>Send Feedback</span>
                    </li>
                </ul>
            </nav>
        </div>
        </header>

        {/* ************  Creation de Post ************************* */}
        {(user.isAuthor === true || user.isAdmin === true) && (
            <div className="acceuil-page__form-container-create">

              <h2 className="acceuil-page__form-container-create__pseudo">{user.pseudo}</h2>
          <form
            action=""
            className="acceuil-page__form-container-create__form-new-post"
            onSubmit={handlePost}
          >
            <div className="acceuil-page__form-container-create__form-new-post__form-text">
              <label htmlFor="message">Synopsis, </label>
              <textarea name="text" id="message" maxLength="585" />
            </div>

            <div className="acceuil-page__form-container-create__form-new-post__form-file">
              
              <label
                htmlFor="file-create"
                className="acceuil-page__form-container-create__form-new-post__form-file__file"
              >

                <i className="fa-solid fa-image"></i>

                <input type="file" name="file" id="file-create" />
                  
              </label>
            </div>

            <button
              type="submit"
              className="acceuil-page__form-container-create__form-new-post__form-btn-post"
            >
              <span className="material-icons-outlined">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </span>
            </button>

          </form>
        </div>
                    )} 
        {/* ************  Affichage des Posts ************************* */}
        <div className="acceuil-page__all-post">
          {datas.slice(0, 5).map((post) => (
            <div
              className="acceuil-page__all-post__post"
              target="e"
              key={post._id}
              id={post._id}
            >
              {/* ************  Post info ************ */}
              <div
                className="acceuil-page__all-post__post__post-info"
                id={post.userId}
              >
                <div className="acceuil-page__all-post__post__post-info__box-text">
                  <div className="acceuil-page__all-post__post__post-info__box-text__post-pseudo">
                    <p>{post.pseudo}</p>
                    <p className="acceuil-page__all-post__post__post-info__box-text__post-pseudo__auteur">Auteur : {post.author}</p>
                  </div>
                  <div className="acceuil-page__all-post__post__post-info__box-text__post-text">
                    <p>Résumé : {post.message}</p>
                  </div>
                </div>
                {post.image && (
                  <div className="acceuil-page__all-post__post__post-info__box-img">
                    <img src={post.image} alt="" className="post-img" />
                  </div>
                )}

                {/* ************  Interaction  ************ */}
                <div className="acceuil-page__all-post__post__post-info__note">
                  <p>Note :{/*  {post.note}*/} </p> 
                </div>
                <div className="acceuil-page__all-post__post__post-info__box-event-interact">
                  <div className="acceuil-page__all-post__post__post-info__box-event-interact__rate">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>

                  <div className="acceuil-page__all-post__post__post-info__box-event-interact__box-update-modal">
                    {(user._id === post.userId || user.isAdmin === true) && (
                      <button
                        onClick={toggleFormAcces}
                        className="btn-modal"
                        id={post._id} 
                      >
                        Modifier
                      </button>
                    )}
                  </div> 
                </div>
              </div>
              {formAcces && (
                <div className="acceuil-page__all-post__post__modal">
                  <div className="acceuil-page__all-post__post__modal__interact">
                    {/* ************  Interaction Formulaire Update post  ************ */}
                    <div className="acceuil-page__all-post__post__modal__interact__form-container-update">
                      <form
                        action=""
                        className="acceuil-page__all-post__post__modal__interact__form-container-update__form-update-post"
                        onSubmit={updatePost}
                      >
                        <div className="acceuil-page__all-post__post__modal__interact__form-container-update__form-update-post__form-text">
                          <label htmlFor="message-update">
                            Modifier votre texte
                          </label>
                          <textarea
                            type="text"
                            name="text"
                            id="message-update"
                            maxLength="585"
                          />
                        </div>
                        <div className="acceuil-page__all-post__post__modal__interact__form-container-update__form-update-post__form-file">
                          <label htmlFor="file-update" className="file">
                            Upload
                            <i className="fa-solid fa-image"></i>
                            Something !
                            <input type="file" name="file" id="file-update" />
                          </label>
                        </div>
                        <button
                          type="submit"
                          className="acceuil-page__all-post__post__modal__interact__form-container-update__form-update-post__form-btn-update"
                        >
                          Modifier
                        </button>
                      </form>
                    </div>
                    {/* ********************* */}

                    <button
                      className="acceuil-page__all-post__post__modal__interact__delete-post"
                      onClick={delPost}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/****************** Les Mieux notés ************************* */}
        <div className="acceuil-page__bests">

        </div>
      </div>

    </>
  );
};

export default Acceuil;
