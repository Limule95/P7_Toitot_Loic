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
    // Raffraichir les données
    const [loading, setLoading] = useState("");

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
                setLoading("chargement")

            })
            .catch((err) => {
                console.log(err);
            });
    }, [loading]);

    const newBio = (e) => {
        e.preventDefault();
        const id = user._id;
        const newBio = "test";

        axios({
            method: "put",
            url: `http://localhost:8000/api/auth/${id}`,
            headers: {
                authorization: `Bearer ${tokenLocalStorage}`,
                "Content-Type": "multipart/form-data",
            },
            data: {
                bio: newBio,
            },
        })
            .then((res) => {
                console.log(res.data.bio);
                setLoading(true);
            })
            .catch((res) => {
                console.log(res);
            });
    };

    return (

        <div className="profil">
            <div className="profil__info">

                <p className="profil__info__pseudo">{user.pseudo}</p>
                <p className="profil__info__name">{user.firstName} {user.lastName}</p>
                {user.bio !== null ? (
                    <div className="profil__info__bio">
                        <p className="profil__info__bio--text">{user.bio}</p>
                        {/* <button className="profil__info__bio--btn" onClick={updateBio}>
                            Modifier votre biographie
                        </button> */}
                    </div>
                ) : (

                    <div className="div">
                        <button className="profil__info__bio--btn" onClick={newBio}>Ajoutez une biographie</button>
                    </div>
                )}

            </div>

        </div>
    )
}

export default Profil