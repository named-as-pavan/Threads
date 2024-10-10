import { Avatar, Box, Flex, Image, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import Actions from '../components/Actions';
import { Menu, MenuButton, MenuItem, MenuList, Portal } from '@chakra-ui/react';
import useShowToast from '../../hooks/useShowToast';
import {formatDistanceToNow} from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atom/userAtom';
import postAtom from '../../atom/postAtom';


const Post = ({ post, postedBy }) => {

    const currentUser = useRecoilValue(userAtom);
    const [posts,setPosts] = useRecoilState(postAtom)
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = useShowToast();
    const [user,setUser] = useState(null);


    // Fetching post details to display
    useEffect(() => {

        const getUser = async () => {
            try {
                if(!user) return;
                const res = await fetch(`/api/users/profile/${postedBy}`)
                const data = await res.json();


                if (data.error) {
                    showToast("Error", error.message, "error")
                    return
                }
                setUser(data)


            } catch (error) {
                showToast("Error", error.message, "error")
                setUser(null)
            };
        }
        getUser();
    }, [postedBy,showToast]);

    const handleDeletePost = async(e)=>{
        e.preventDefault();
        try {
            if(!window.confirm("Aru you sure want to delete this post")) return


            const res = await fetch(`/api/posts/${post._id}`,{
                method:"DELETE",
            })
            const data = res.json();
            if(data.error){
                showToast("Error",data.error.message,"error")
            }
            setPosts(posts.filter((p) => p._id !== post._id))
            showToast("Success","Post deleted successfully","success")
        } catch (error) {
            showToast("Error", error.message, "error")
        }
    }

    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            toast({
                title: "link copied",
                status: "success",
                isClosable: true,
            });
        });
    };

    if(!user) return null

    return (


        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={'column'} alignItems={'center'}>
                <Avatar name={user.name} onClick={(e)=> {
                    e.preventDefault()
                    navigate(`/${user.username}`)
                }}  src={user?.profilePic} size={'md'} />
                <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                <Box position={'relative'} w={'full'}>

                    {post.replies.length === 0 && <Text textAlign={'center'}>😥</Text>}

                    {post.replies[0] &&(
                        <Avatar
                            size={'xs'}
                            name='john'
                            src={post.replies[0].userProfilePic}
                            position={'absolute'}
                            top={'-12px'}
                            left={'15px'}
                            padding={'2px'}
                        />
                    )}
                 {post.replies[1] &&(
                        <Avatar
                            size={'xs'}
                            name='john'
                            src={post.replies[1].userProfilePic}
                            position={'absolute'}
                            top={'10px'}
                            left={'0px'}
                            padding={'2px'}
                        />
                    )}
                    {post.replies[2] &&(
                        <Avatar
                            size={'xs'}
                            name='john'
                            src={post.replies[2].userProfilePic}
                            position={'absolute'}
                            top={'10px'}
                            left={'30px'}
                            padding={'2px'}
                        />
                    )}
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex w={'full'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'} onClick={(e)=> {
                    e.preventDefault()
                    navigate(`/${user.username}`)
                }}>{user?.username }</Text>
                        <Image src='/verified.png' w={4} h={4} ml={1} />
                    </Flex>
                    <Flex gap={4} alignItems={'center'}>
                        <Text fontSize={'xs'} w={36} textAlign={'right'} color={'gray.light'}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>

                        {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost}/>}
                        
                        {/* update in future */}
                        {/* <Menu>


                            <MenuButton as="button">
                                <BsThreeDots />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={'gray.dark'}>
                                    <MenuItem
                                        bg={'gray.dark'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            copyUrl();
                                        }}
                                    >
                                        Link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu> */}
                    </Flex>
                </Flex>
                <Link to={`/${user.username}/post/${post._id}`}>
                    <Text fontSize={'sm'}>{post.text}</Text>
                    {post.img && (
                        <Box
                            borderRadius={6}
                            overflow={'hidden'}
                            border={'1px solid'}
                            borderColor={'gray.light'}
                        >
                            <Image src={post.img} w={'full'}></Image>
                        </Box>
                    )}
                </Link>
                <Flex gap={3} my={1}>
                    <Actions post={post}/>
                </Flex>
            </Flex>
        </Flex>
        

    );
};

export default Post;
