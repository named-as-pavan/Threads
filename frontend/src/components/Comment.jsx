import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'

const Comment = ({reply,lastReply}) => {
    // const [liked,setLiked] = useState()
  return (
    <>
    <Flex gap={4} my={2} py={2} w={'full'}>
        <Avatar src={reply.userProfilePic} size={'sm'}/>
        <Flex gap={1} w={'full'} flexDirection={'column'}>
            <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>{reply.username}</Text>
                <Flex gap={2} alignItems={'center'}>
                    
                </Flex>
            </Flex>
            <Text>{reply.text}</Text>
        </Flex>
    </Flex>
    {!lastReply ? <Divider my={4}/> : null}

    </>
    
)
}

export default Comment
{/* <Actions liked={liked} setLiked={setLiked}/>
<Text fontSize={'sm'} color={'gray.light'}>
    {likes + (liked ? 0 : 1)}
</Text> */}


{/* <Text fontSize={'sm'} color={'gray.light'}>{createdAt}</Text>
                    <BsThreeDots/> */}





