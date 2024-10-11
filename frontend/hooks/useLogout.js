import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atom/userAtom'
import useShowToast from './useShowToast';

const useLogout = () => {

    const  showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);
    const Logout = async()=>{
        try {
            const res = await fetch("/api/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
            })
            const data = await res.json()
            if(data.error){
                
                    showToast("Error",error.data,"error")
                    return;
            
            }

            localStorage.removeItem("user-threads")
            setUser(null)


        } catch (error) {
            console.log(error)
            
        }
    }

    return Logout
}


export default useLogout