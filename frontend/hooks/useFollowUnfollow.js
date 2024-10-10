import  { useState } from 'react'
import useShowToast from './useShowToast'
import { useRecoilValue } from 'recoil'
import userAtom from '../atom/userAtom'

const useFollowUnfollow = (user) => {
    const currentUser = useRecoilValue(userAtom)
    const [following,setFollowing] = useState(user?.followers.includes(currentUser?._Id) || false)
    const [updating,setUpdating ] = useState(false)

    const showToast = useShowToast()
  
    const handleFollowUnfollow = async () => {

        if(!currentUser){
          showToast("Error","Please login to follow","error")
          return
        }
        if(updating) return
        setUpdating(true);
        try {
          const res = await fetch(`/api/users/follow/${user._id}`, {
            method: "POST",  // Corrected method case
            headers: {
              "Content-Type": "application/json",  // Fixed header key
            },
          });
      
          const data = await res.json();
      
          if (data.error) {
            showToast("Error", data.error, 'error'); // Use data.error.message
            return;
          }
      
          if (following) {
            showToast("Success", `Unfollowed ${user.name}`, "success");
            user.followers.pop();
          } else {
            showToast("Success", `Followed ${user.name}`, "success");
            user.followers.push(currentUser?._id); // Add current user to the followers list
          }
      
          setFollowing(!following); // Toggle following state
      
        } catch (error) {
          showToast("Error", error.message, 'error');
        }
        finally{
          setUpdating(false)
        }
      };

      return {handleFollowUnfollow,updating,following}
    
}

export default useFollowUnfollow