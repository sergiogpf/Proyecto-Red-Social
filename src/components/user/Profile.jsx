import React, { useEffect, useState } from 'react'
import avatar from '../../assets/img/user.png'
import { GetProfile } from '../../helpers/GetProfile'
import { Link, useParams } from 'react-router-dom'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { PublicationList } from '../publication/PublicationList'

export const Profile = () => {

  const { auth } = useAuth()
  const [user, setUser] = useState({})
  const [counters, setCounters] = useState({})
  const [iFollow, setIFollow] = useState(false)
  const [publications, setPublications] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const params = useParams()


  //Token de autenticación
  const token = localStorage.getItem("token")

  const getDataUser = async () => {
    let dataUser = await GetProfile(params.userId, setUser)

    if (dataUser.following && dataUser.following._id) {
      setIFollow(true)
    }
  }


  useEffect(() => {
    getDataUser()

    getCounters()

    getPublications(1, true)
  }, [])


  useEffect(() => {
    getDataUser()

    getCounters()

    setMore(true)

    getPublications(1, true)
  }, [params])

  const getCounters = async () => {
    const request = await fetch(Global.url + "user/counters/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const data = await request.json()

    if (data) {
      setCounters(data)
    }

  }


  const follow = async (userId) => {
    //Petición al backend para guardar follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const data = await request.json()

    if (data.status == "success") {
      //Actualizar estado de following agregando el nuevo follow
      setIFollow(true)

    }


  }

  const unfollow = async (userId) => {
    //Petición al backend para borrar follow
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const data = await request.json()


    if (data.status == "success") {

      setIFollow(false)

    }

  }

  const getPublications = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(Global.url + "publication/user/" + params.userId + "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const data = await request.json()

    if (data.status == "success") {
      let newPublications = data.publications

      if (!newProfile && publications.length >= 1) {
        newPublications = [...publications, ...data.publications]
      }

      if (newProfile) {
        newPublications = data.publications
        setMore(true)
        setPage(1)
      }

      setPublications(newPublications)

      if (!newProfile && publications.length >= (data.total - data.publications.length)) {
        setMore(false)
      }

      if (data.pages <= 1) {
        setMore(false)
      }

    }
  }




  return (
    <>


      <header className="aside__profile-info">

        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {user.image != "default.png" && <img src={Global.url + "user/avatar/" + user.image} className="container-avatar__img" alt="Foto de perfil" />}
            {user.image === "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>{user.name} {user.surname}</h1>

              {user._id != auth._id &&
                (iFollow ?
                  <button className="content__button content__button--right post__button" onClick={() => unfollow(user._id)}>Dejar de seguir</button>
                  :
                  <button className="content__button content__button--right" onClick={() => follow(user._id)}>Seguir</button>
                )
              }

            </div>
            <h2 className="container-names__nickname">{user.nick}</h2>
            <p>{user.bio}</p>

          </div>
        </div>

        <div className="profile-info__stats">

          <div className="stats__following">
            <Link to={"/social/siguiendo/" + user._id} className="following__link">
              <span className="following__title">Siguiendo</span>
              <span className="following__number">{counters.following}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link to={"/social/seguidores/" + user._id} className="following__link">
              <span className="following__title">Seguidores</span>
              <span className="following__number">{counters.followed}</span>
            </Link>
          </div>


          <div className="stats__following">
            <Link to={"/social/perfil/" + user._id} className="following__link">
              <span className="following__title">Publicaciones</span>
              <span className="following__number">{counters.publications}</span>
            </Link>
          </div>


        </div>
      </header>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}

      />

      <br />
    </>
  )
}
