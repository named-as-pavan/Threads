import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser';
import useShowToast from '../../hooks/useShowToast';

const SuggestedUsers = () => {
    const [loading,setLoading] = useState(true);
    const [suggestedUsers,setSuggestedUsers] = useState([]);
    const showToast = useShowToast();


    useEffect(()=> {
        const getSugggestedUsers = async()=>{
            setLoading(true)
            try {
                const res = await fetch("/api/users/suggested");
                if (!res.ok) {
                    const errorResponse = await res.json(); // Fetch error details
                    console.log(errorResponse.error); // Log the error message from the response
                    showToast("Error", "Error in fetching suggested users", "error");
                    return;
                }

                const data = await res.json()
                if(data.error){
                    showToast("Error",data.error,"error")
                    return
                }
                setSuggestedUsers(data)            
             } catch (error) {
                showToast("Error",error.message,"error")
                    return
            }
            finally{
                setLoading(false)
            }
        }
        getSugggestedUsers();
    }, [showToast,setSuggestedUsers])



  return (
    <>
    <Text mb={4} fontWeight={'bold'}>
        Suggested Users
    </Text>
    <Flex direction={'column'} gap={4}>

        {!loading && suggestedUsers.map(user => <SuggestedUser key={user._id} user={user}/>)}


        {loading && [0,1,2,3,4].map((_,id) =>(
            <Flex gap={2} key={id} alignItems={'center'} p={'1'} borderRadius={'md'}>

            
            <Box>
            <SkeletonCircle size={"10"} />
          </Box>
          
          <Flex w={"full"} flexDirection={"column"} gap={2}>
            <Skeleton h={"8px"} w={"86px"} />
            <Skeleton h={"8px"} w={"90px"} />
          </Flex>
          
          <Flex>
            <Skeleton h={"20px"} w={"60px"} />
          </Flex>
          </Flex>
          
        ))}
    </Flex>
    </>
  )
}

export default SuggestedUsers


{/* <Flex gap={2} alignItems={'center'} p={'1'} borderRadius={'md'}>

            
<Box>
<SkeletonCircle size={"10"} />
</Box>

<Flex w={"full"} flexDirection={"column"} gap={2}>
<Skeleton h={"8px"} w={"86px"} />
<Skeleton h={"8px"} w={"90px"} />
</Flex>

<Flex>
<Skeleton h={"20px"} w={"60px"} />
</Flex>
</Flex> */}

