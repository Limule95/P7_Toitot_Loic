import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/MASTERmanga.png";

const Acceuil = () => {
  // Récupération de l'id et du token de la personne connectée
  const userIdLocalStorage = localStorage.getItem("userId");
  const tokenLocalStorage = localStorage.getItem("token");

  // Si il n'y a pas de pseudo ou de token, alors la personne est renvoyée sur la page de connexion/inscription "/"
  if (!tokenLocalStorage || !userIdLocalStorage) {
    window.location = "/";
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Récupération de tous les posts
  const [datas, setDatas] = useState([]);
  // Récupération des informations de l'utilisateur connecté
  const [user, setUser] = useState([]);
  // Rafraîchir les données
  const [loading, setLoading] = useState("");
  // Contrôle l'accès aux modifications ou suppression de post
  const [formAcces, setFormAcces] = useState(false);
  // Récupération de l'id du post en fonction des interactions
  const [modalId, setModalId] = useState("");

  // function de récupération de l'id du post et de control d'accès aux modifications des posts
  const toggleFormAccess = (e) => {
    setModalId(e.target.id);
    setFormAcces(!formAcces);
  };

  useEffect(() => {
    // Requête (GET) pour récupérer les informations de l'utilisateur connecté
    axios({
      method: "GET",
      url: `http://localhost:8000/api/auth/${userIdLocalStorage}`,
      headers: {
        Authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      }, [loading]);

    // Requête (GET) pour récupérer tous les posts
    axios({
      method: "GET",
      url: "http://localhost:8000/api/post",
      headers: {
        Authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setDatas(res.data);
        setLoading("true");
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);

  const handlePost = (e) => {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const pseudo = user.pseudo;
    const author = user.isAuthor;
    const message = document.querySelector("#message").value;
    const image = document.getElementById("file-create").files[0];

    // Requête (POST) pour créer un nouveau post
    axios({
      method: "post",
      url: "http://localhost:8000/api/post",
      headers: {
        Authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "multipart/form-data",
      },
      data: {
        pseudo,
        title,
        message,
        author,
        image,
      },
    })
      .then((res) => {
        setLoading("tres");
        document.querySelector("#title").value = "";
        document.querySelector("#message").value = "";
        document.getElementById("file-create").value = "";
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const delPost = (e) => {
    e.preventDefault();
    const id = modalId;

    // Requête (DELETE) pour supprimer un post
    axios({
      method: "delete",
      url: `http://localhost:8000/api/post/${id}`,
      headers: {
        Authorization: `Bearer ${tokenLocalStorage}`,
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

  const ratePost = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const rate = e.target.dataset.value;

    // Requête (PATCH) pour noter un post
    axios({
      method: "patch",
      url: `http://localhost:8000/api/post/${id}`,
      headers: {
        Authorization: `Bearer ${tokenLocalStorage}`,
        "Content-Type": "application/json",
      },
      data: {
        rate,
      },
    })
      .then((res) => {
        console.log(res);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location = "/";
  };

  const toProfile = (e) => {
    e.preventDefault();
    window.location = "/Profil";
  };
  // retour HTML FRONT
  return (
    <>
      <div className={`acceuil-page ${isMenuOpen ? "menu-open" : ""}`}>
        {/* ************************HEADER FINAL************************* */}
        <header>
          <div className="menu">
            <div className="menu__toggle" onClick={toggleMenu}>
              <i className={`bx ${isMenuOpen ? "bx-chevron-left" : "bx-chevron-right"}`}></i>
            </div>

            <div className="menu__logo">
              <img src={logo} alt="logo Groupomania" className="logo-site" />
              <h3>Master manga</h3>
            </div>

            <nav className="menu__nav">
              <div className="menu__nav__title">Management</div>

              <ul>
                <li className="menu__nav__item">
                  <i className="bx bxs-dashboard"></i>
                  <span>Home</span>
                </li>
                <li className="menu__nav__item">
                  <i className="bx bxs-wallet"></i>
                  <span>Wallet</span>
                </li>
                <li className="menu__nav__item">
                  <i className="bx bxs-basket"></i>
                  <span>Basket</span>
                </li>
                <li className="menu__nav__item">
                  <i className="bx bxs-bell"></i>
                  <span>Notifications</span>
                </li>
                <li className="menu__nav__item" onClick={toProfile}>
                  <i className="bx bxs-user-rectangle"></i>
                  <span>Profil</span>
                </li>
                <li className="menu__nav__item">
                  <i className="bx bx-cog"></i>
                  <span>Settings</span>
                </li>
                <li className="menu__nav__item" onClick={logOut}>
                  <i className="bx bx-log-out"></i>
                  <span>Logout</span>
                </li>
              </ul>

              <div className="menu__nav__title">Supports</div>

              <ul>
                <li className="menu__nav__item">
                  <i className="bx bxs-help-circle"></i>
                  <span>Get Help</span>
                </li>
                <li className="menu__nav__item">
                  <i className="bx bxs-message-dots"></i>
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
              <div className="acceuil-page__form-container-create__form-new-post__title">
                <label htmlFor="title">Titre, </label> <br />
                <input type="text" id="title" className="acceuil-page__form-container-create__form-new-post__title--input" maxLength="100" />
              </div>

              <div className="acceuil-page__form-container-create__form-new-post__form-text">
                <label htmlFor="message">Synopsis, </label>
                <textarea name="text" rows="50" id="message" className="acceuil-page__form-container-create__form-new-post__form-text--textarea" maxLength="500" />
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

          {datas.slice(0, 3).map((post) => (
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
                    <p>{post.title}</p>
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
                {(post.moyenne === null) && (
                  <div className="acceuil-page__all-post__post__post-info__note">
                    <p>Note : n/a </p>
                  </div>
                )}
                {(post.moyenne != null) && (
                  <div className="acceuil-page__all-post__post__post-info__note">
                    <p>Note : {post.moyenne} </p>
                  </div>
                )}

                <div className="acceuil-page__all-post__post__post-info__box-event-interact">

                  {(user.isAuthor === false) && (
                    <div className="acceuil-page__all-post__post__post-info__box-event-interact__rate">
                      <i id={post._id} data-value="5" className="fa-solid fa-star b1" onClick={ratePost}></i>
                      <i id={post._id} data-value="4" className="fa-solid fa-star b2" onClick={ratePost}></i>
                      <i id={post._id} data-value="3" className="fa-solid fa-star b3" onClick={ratePost}></i>
                      <i id={post._id} data-value="2" className="fa-solid fa-star b4" onClick={ratePost}></i>
                      <i id={post._id} data-value="1" className="fa-solid fa-star b5" onClick={ratePost}></i>
                    </div>
                  )}


                  {(user._id === post.userId || user.isAdmin === true) && (
                    <div className="acceuil-page__all-post__post__post-info__box-event-interact__box-update-modal">
                      <button
                        onClick={toggleFormAccess}
                        className="btn-modal"
                        id={post._id}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
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
                            maxLength="500"
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
          <h2 className="acceuil-page__bests-title">Les mieux nôtés,</h2>

          <div className="acceuil-page__bests__swipe">

          </div>
        </div>
      </div>

    </>
  );
};

export default Acceuil;
