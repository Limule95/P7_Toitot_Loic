import React, { useState, useEffect } from "react";
import axios from "axios";

function Profil() {
    // recuperation de l'id et token de la personne connecté
    let userIdLocalStorage = localStorage.getItem("userId");
    let tokenLocalStorage = localStorage.getItem("token");

    // Si il n'y a pas de pseudo ou de token, alors la personne est renvoyer sur la page de connection/inscription "/"
    if (tokenLocalStorage === null && userIdLocalStorage === null) {
        window.location = "/";
    }

    // Recuperations des informations de l'user connecté
    const [user, setUser] = useState([]);

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
    });

    const addBio = () => {
        const newBio = prompt("Veuillez entrer votre biographie :");

        if (newBio !== null) {
            axios({
                method: "PUT",
                url: `http://localhost:8000/api/auth/${userIdLocalStorage}`,
                headers: {
                    authorization: `Bearer ${tokenLocalStorage}`,
                    "Content-Type": "application/json",
                },
                data: {
                    bio: newBio,
                },
            })
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };


    const formAcces = user.bio === null;
    return (

        <div className="profil">
            <div className="profil__info">

                <p className="profil__info__pseudo">{user.pseudo}</p>
                <p className="profil__info__name">{user.firstName} {user.lastName}</p>
                {user.bio !== null ? (
                    <div className="profil__info__bio">
                        <p className="profil__info__bio--text">{user.bio}</p>
                        <button className="profil__info__bio--btn" onClick={addBio}>
                            Ajouter une biographie
                        </button>
                    </div>
                ) : (

                    <div className="div">
                        <button className="profil__info__bio--btn" onClick={addBio}>Ajoutez une biographie</button>
                        {formAcces && (
                            <div className="acceuil-page__all-post__post__modal">
                                <div className="acceuil-page__all-post__post__modal__interact">
                                    {/* ************  Interaction Formulaire Update post  ************ */}
                                    <div className="acceuil-page__all-post__post__modal__interact__form-container-update">
                                        <form
                                            action=""
                                            className="acceuil-page__all-post__post__modal__interact__form-container-update__form-update-post"
                                            onSubmit={""}
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
                                        onClick={""}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                )}

            </div>

        </div>
    )
}

export default Profil