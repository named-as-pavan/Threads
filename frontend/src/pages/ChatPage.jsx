import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversation from '../components/Conversation';
import { GiConversation } from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../../hooks/useShowToast';
import { conversationsAtom, selectedConversationAtom,} from '../../atom/messagesAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atom/userAtom';
import { useSocket } from '../../context/SocketContext';

const ChatPage = () => {

  const [loadingConversations,setLoadingConversations] = useState(true)

  const[selectedConversation,setSelectedConversation] = useRecoilState(selectedConversationAtom)

  const [ conversations,setConversations] = useRecoilState(conversationsAtom);
  
  const [searchText, setSearchText] = useState("")
  
  const [searchingUser,setSearchingUser] = useState(false);
  
  const currentUser = useRecoilValue(userAtom);
  
  const showToast = useShowToast();

  const {socket,onlineUsers = []} = useSocket();

 
  useEffect(()=>{
    socket?.on("messagesSeen",({conversationId})=>{
      setConversations(prev =>{
        const updatedConversation = prev.map(conversation =>{
          if(conversation._id == conversationId){
            return{
              ...conversation,
              lastMessage:{
                ...conversation.lastMessage,
                seen:true
              }
            }
          }
          return conversation
        })
        return updatedConversation
      })
    })
  },[socket,setConversations])


  useEffect(()=>{

    const getConversations = async()=>{
       try {
        if (selectedConversation.mock) return;


        const res = await fetch("/api/messages/conversations")
        const data = await res.json();

        if(data.error){
          showToast("Error",data.error,"error")
          return
        }
        setConversations(data);
       } catch (error) {
        showToast("Error",error.message,"error")
       }
       finally{
        setLoadingConversations(false)
       }
    }
    getConversations();
  },[showToast,setConversations])


  const handleConversationSearch = async(e)=>{
    e.preventDefault();
    setSearchingUser(true);
    try {
      
      const res = await fetch(`/api/users/profile/${searchText}`)
      const searchedUser = await res.json();

      if(searchedUser.error){
        showToast("Error",searchedUser.error,"error")
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id
      if(messagingYourself){
        showToast("Error","Dont'try to message yourself","error")
        return;
      }
      const conversationAlreadyExists = conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)
      if(conversationAlreadyExists){
        setSelectedConversation({
          _id:conversationAlreadyExists._id,
          userId:searchedUser._id,
          username:searchedUser.username,
          userProfilePic:searchedUser.profilePic,
        })
        return;
      }

      const mockConversation = {
        mock:true,
        lastMessage :{
          text:"",
          sender:"",
        },
        _id:Date.now(),
        participants:[
          {
            _id:searchedUser._id,
            username:searchedUser.username,
            profilePic:searchedUser.profilePic
          }
        ]
      }

      setConversations((prevConv)=> [...prevConv, mockConversation])



    } catch (error) {
      showToast("Error",error.message,"error")
    }
    finally{
      setSearchingUser(false)
    }
  }


  return <Box position={'absolute'}
    left={'50%'} w={{
      lg: "750px",
      md: '80%',
      base: "100%",
    }}
    p={4}
    transform={'translateX(-50%)'}>

    <Flex gap={4} flexDirection={{
      base: "column",
      md: "row"
    }} maxW={{
      base: "400px",
      md: "full"
    }} mx={'auto'}>
      <Flex flex={30} gap={2} flexDirection={'column'} maxW={{
        sm: "250px",
        md: 'full'
      }} mx={'auto'}>
        <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>Your conversation</Text>
        <form onSubmit={handleConversationSearch}>
          <Flex alignItems={'center'} gap={2}>
            <Input placeholder='Search for a user' onChange={(e)=> setSearchText(e.target.value)} value={searchText}/>
            <Button size={'sm'} onClick={handleConversationSearch} isLoading={searchingUser}>
              <SearchIcon/>
            </Button>
          </Flex>
        </form>
        {loadingConversations && (
          [1, 2, 3, 4, 5].map((_, i) => (
            <Flex key={i} gap={4} alignItems={'center'} p={1} borderRadius={'md'}>
              <Box>
                <SkeletonCircle size={10} />
              </Box>
              <Flex w={'full'} flexDirection={'column'} gap={3}>
                <Skeleton h={'10px'} w={'80%'} />
                <Skeleton h={'8px'} w={'90%'} />
              </Flex>
            </Flex>
          ))
        )}



        {!loadingConversations && 
        conversations.map((conversation) =>(
            <Conversation key={conversation._id}
            conversation={conversation}
            isOnline={onlineUsers.includes(conversation.participants[0]._id)}/>
          
        ))}
      </Flex>
      {!selectedConversation._id &&(

       <Flex flex={70} borderRadius={'md'} padding={2} flexDir={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'400px'}>
        <GiConversation size ={100}/>
        <Text fontSize={20}>Select A Conversation To start messaging</Text>
        </Flex> 
      )}

      {selectedConversation._id && <MessageContainer/>}
      

    </Flex>
  </Box>
  
};

export default ChatPage