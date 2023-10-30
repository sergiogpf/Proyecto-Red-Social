import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'


export const Logout = () => {

    const {setAuth, setCounters} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        //Vaciar localStorage
        localStorage.clear()

        //Settear estados globales a vacio
        setAuth({})
        setCounters({})

        //Navigate (redirección) a login
        navigate("/login")
    })
  return (
    <h1>CERRANDO SESIÓN...</h1>
  )
}
