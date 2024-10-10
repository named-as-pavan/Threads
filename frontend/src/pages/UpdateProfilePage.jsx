





import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    HStack,
    Avatar,
    AvatarBadge,
    IconButton,
    Link,
    Center,
  } from '@chakra-ui/react'
  import { SmallCloseIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react'
import React from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../../atom/userAtom'
import usePreviewImg from '../../hooks/usePreviewImg'
import useShowToast from '../../hooks/useShowToast'
import { Link as RouterLink } from 'react-router-dom'
  
  export default function UserProfilePage() {

    const [user,setUser]= useRecoilState(userAtom)
    const showToast = useShowToast();

    const [updating,setUpdating] = useState(false)


    const fileRef = useRef(null)


    
    const [inputs, setInputs] = useState({
      name:user.name,
      username:user.username,
      email:user.email,
      password:"",
      bio:user.bio
  })


    const { handleImageChange,imgUrl } = usePreviewImg();

    
    const handleSubmit = async (e) => {
      setUpdating(true)
      if(updating) return

      e.preventDefault();
  
      
  
      try {
          const res = await fetch(`/api/users/update/${user._id}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ ...inputs, profilePic: imgUrl }), // Ensure imgUrl is defined
          });
  
          const data = await res.json(); 
          if(data.error){
            showToast("Error",data.error,"error")
          }

          setInputs(data)
          

          localStorage.setItem("user-threads",JSON.stringify(data))
  
          if (!res.ok) {
              throw new Error(data.error || "Failed to update profile");
          }
  
          showToast("Success", "Profile updated successfully", "success");
          setUser(data)
      } catch (error) {
          console.error("Error updating profile:", error);
          showToast("Error", error.message, "error");
      }
      finally{
        setUpdating(false)
      }
  };
  
    

    // console.log(user)
    return (
  <form onSubmit={handleSubmit}>
      <Flex
        align={'center'}
        justify={'center'} my={8}
        >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('gray.light', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <FormLabel>User Icon</FormLabel>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.profilePic}>
                </Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={()=> fileRef.current.click()}>Change Avatar</Button>
                <Input type='file' hidden ref={fileRef} onChange={handleImageChange}></Input>
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input onChange={(e)=> setInputs((inputs)=>  ({...inputs,name:e.target.value}))} value={inputs.name}
              placeholder="Full name"
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName" onChange={(e)=> setInputs((inputs)=>  ({...inputs,username:e.target.value}))} value={inputs.username}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
            onChange={(e)=> setInputs((inputs)=>  ({...inputs,email:e.target.value}))} value={inputs.email}
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input  
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input onChange={(e)=> setInputs((inputs)=>  ({...inputs,bio:e.target.value}))}
              placeholder="BIO"
              value={inputs.bio}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Link as ={RouterLink} to={`/${user.username}`}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            
            </Link>
            <Button
              bg={'green.600'}
              color={'white'}
              w="full"
              loadingText="updating"
              _hover={{
                bg: 'green.400',
              }} type='submit' isLoading={updating}>
              Update
            </Button>
          </Stack>
        </Stack>
      </Flex>
  </form>
    )
  }