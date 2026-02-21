"use client"
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider ({children}){
    const [user , setUser] = useState(null)
    const [loading , setLoading] = useState(true)

    useEffect(()=>{
        const getUser = async()=>{
            try{
                const res = await fetch("/api/auth/me")
                if(res.ok){
                    const data = await res.json()
                    setUser(data.user)
                }

            }
            catch(error){
                setUser(null)
            }
            finally{
                setLoading(false)
            }

        }
        getUser()
    } , [])

    return(
        <UserContext.Provider value ={{user ,setUser , loading}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = ()=> useContext(UserContext)