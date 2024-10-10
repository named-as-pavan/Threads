import { Button, Toast } from "@chakra-ui/react";


import React from 'react'
import { useSetRecoilState } from "recoil";
import userAtom from "../../atom/userAtom";
import useShowToast from "../../hooks/useShowToast";
import { FiLogOut } from 'react-icons/fi';


const LogoutButton = () => {
    // const [loading,setLoading]=useState(false)

    const showToast = useShowToast()
     const setUser = useSetRecoilState(userAtom)

    const handleLogout = async()=>{
        try {
            const res = await fetch("/api/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
            })
            const data = (await res).json();
            console.log(data)
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
  return (
    <Button position={"fixed"} top={'30px'} right={'30px'} size={"sm"} onClick={handleLogout} border={'gray.light'}>
        <FiLogOut size={20} />
    </Button>
  )
}

export default LogoutButton