import React, { useState, useEffect } from "react";
import axios from "axios";

function Profil() {
    // Récupération de l'id et du token de la personne connectée
    let userIdLocalStorage = localStorage.getItem("userId");
    let tokenLocalStorage = localStorage.getItem("token");

    // Si il n'y a pas de pseudo ou de token, alors la personne est renvoyée sur la page de connexion/inscription "/"
    if (tokenLocalStorage === null && userIdLocalStorage === null) {
        window.location = "/";
    }

    // Récupération des informations de l'utilisateur connecté
    const [user, setUser] = useState([]);
    // Rafraîchir les données
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [loading]);

    const newBio = (e) => {
        e.preventDefault();
        const id = user._id;
        const addBio = "je teste ma bio";

        axios({
            method: "put",
            url: `http://localhost:8000/api/auth/${id}`,
            headers: {
                authorization: `Bearer ${tokenLocalStorage}`,
                "Content-Type": "application/json",
            },
            data: {
                bio: addBio,
            },
        })
            .then((res) => {
                console.log(res.data);
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
                <p className="profil__info__name">
                    {user.firstName} {user.lastName}
                </p>
                {user.bio !== null ? (
                    <div className="profil__info__bio">
                        <p className="profil__info__bio--text">{user.bio}</p>
                        {/* <button className="profil__info__bio--btn" onClick={updateBio}>
              Modifier votre biographie
            </button> */}
                    </div>
                ) : (
                    <div className="div">
                        <button className="profil__info__bio--btn" onClick={newBio}>
                            Ajouter une biographie
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profil;
