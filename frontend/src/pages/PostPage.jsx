import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import { useState } from 'react'
import Comment from '../components/Comment'
import useGetUserProfile from '../../hooks/useGetUserProfile'
import useShowToast from '../../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../../atom/userAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import postAtom from '../../atom/postAtom'

const PostPage = () => {

  // user state comming from hook
  const {user,loading} = useGetUserProfile();
  const showToast = useShowToast();
  const [posts,setPosts] = useRecoilState(postAtom)
  
  const currentUser = useRecoilValue(userAtom)

  const {pid} = useParams();

  const navigate = useNavigate();

  const currentPost = posts?.[0]

  const handleDeletePost = async()=>{
    try {
        if(!window.confirm("Aru you sure want to delete this post")) return


        const res = await fetch(`/api/posts/${currentPost._id}`,{
            method:"DELETE",
        })
        const data = res.json();
        if(data.error){
            showToast("Error",data.error.message,"error")
        }
        showToast("Success","Post deleted successfully","success")
        navigate(`/${user.username}`)
    } catch (error) {
        showToast("Error", error.message, "error")
    }
}
  
  useEffect(() => {

    const getPost = async()=>{
      setPosts([])

      try {
        console.log("sent")
        const res = await fetch(`/api/posts/${pid}`);
        console.log(pid)
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error")
          return;
        }
        console.log(data)
        setPosts([data]);

      } catch (error) {
        showToast("Error",error.message,"error")
      }
    }
  

    getPost();
  }, [showToast,pid,setPosts])
  

  if(!user && loading){
    return(
      <Flex justifyContent={'center'}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }

  if(!currentPost) return null
  

  return (
    <>
    <Flex>
      <Flex w={'full'} alignItems={'center'} gap={3}>
        <Avatar src={user.userProfilePic} size={'md'} name='mark zuckerburg'/>
        <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
        <Image src='/verified.png' w='4' h={'4'} ml={'4'}/>
      </Flex>
      <Flex gap={4} alignItems={'center'}>
                        <Text fontSize={'xs'} w={36} textAlign={'right'} color={'gray.light'}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>

                        {currentUser?._id === user._id && <DeleteIcon size={20} cursor={'pointer'} onClick={handleDeletePost}/>}</Flex>
        {/* <BsThreeDots/> */}
      
    </Flex>

    <Text my={3}>{currentPost.text}</Text>

    {currentPost.img && (
      <Box
      borderRadius={6}
      overflow={'hidden'}
      border={'1px solid'}
      borderColor={'gray.light'}
  >
      <Image src={currentPost.img} w={'full'}></Image>
  </Box>
    )}
                        <Flex gap={3} my={3}>
                          <Actions post={currentPost}/>
                        </Flex>
                        <Divider my={4}/>

                        <Flex justifyContent={'space-between'}>
                          <Flex alignItems={'center'}>
                            <Text fontSize={'2xl'}>👋</Text>
                            <Text color={'gray.light'}> Get the app</Text>
                          </Flex>
                          <Button>
                            Get
                          </Button>
                        </Flex>

                        <Divider my={4}/>

                        {currentPost.replies.map(reply=>(
                          <Comment key={reply._id} 
                          reply={reply}
                          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}/>

                        ))}
                        {/* <Comment 
                        comment="looking good"
                        createdAt="2d" likes={100} name={"johndoe"} userAvatar="photo5.png"/> */}
    </>
  )
}

export default PostPage