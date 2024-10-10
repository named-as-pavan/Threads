import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from 'socket.io-client';
import userAtom from "../atom/userAtom";

const SocketContext = createContext();


export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const user = useRecoilValue(userAtom);
    const [onlineUsers , setOnlineUsers] = useState([])

    useEffect(() => {
        if (user?._id) {
            const socket = io("http://localhost:5000", {
                query: {
                    userId: user._id
                }
            });

            setSocket(socket);

            socket.on("getOnlineUsers",(users)=>{
                setOnlineUsers(users);
            })

            // Cleanup function to close the socket when the component unmounts
            return () => {
                socket.close();
                setSocket(null); // Clear the socket state
            };
            
        }

    }, [user?._id]); // Only run when user ID changes
    return (
        <SocketContext.Provider value={{ socket ,onlineUsers}}>
            {children}
        </SocketContext.Provider>
    );
}
