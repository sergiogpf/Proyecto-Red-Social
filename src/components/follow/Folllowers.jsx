import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import { UserList } from '../user/UserList'
import { useParams } from 'react-router-dom'
import { GetProfile } from '../../helpers/getProfile'

export const Followers = () => {

  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [more, setMore] = useState(true)
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState({})

  const params = useParams()

  useEffect(() => {
    getUsers(1)
    GetProfile(params.userId, setUserProfile)
  }, [])

  //Token de autenticación
  const token = localStorage.getItem("token")

  const getUsers = async (nextPage = 1) => {

    //Efecto de carga
    setLoading(true)

    //Sacar userId de la url
    const userId = params.userId

    //Petición para sacar usuarios
    const request = await fetch(Global.url + "follow/followers/" + userId + "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const data = await request.json()

    //Recorrer y limpiar follows para quedarme con followed
    let cleanUsers = []
    data.follows.forEach(follow => {
      cleanUsers = [...cleanUsers, follow.user]
    })

    data.users = cleanUsers



    //Crear un estado para listarlos
    if (data.users && data.status == "success") {

      let newUsers = data.users

      if (users.length >= 1) {
        newUsers = [...users, ...data.users]
      }

      setUsers(newUsers)

      setFollowing(data.user_following)

      setLoading(false)

      //Paginación
      if (users.length >= (data.total - data.users.length)) {

        setMore(false)
      }

    }


  }





  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Seguidores de {userProfile.nick}</h1>
      </header>

      <UserList
        users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        more={more}
        loading={loading}
      />


      <br />
    </>

  )
}
