import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import usePreviewImg from '../../hooks/usePreviewImg'
import { BsFillImageFill } from 'react-icons/bs'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../../atom/userAtom'
import useShowToast from '../../hooks/useShowToast'
import postAtom from '../../atom/postAtom'
import { useParams } from 'react-router-dom'

const CreatePost = () => {


    const [loading,setLoading] = useState(false)

    const [posts,setPosts] = useRecoilState(postAtom);
    const {username} = useParams();


    const MAX_CHAR = 500
    const { isOpen, onOpen, onClose } = useDisclosure()

    const showToast = useShowToast();

    const { handleImageChange,imgUrl,setImgUrl } = usePreviewImg();

    const imageRef = useRef(null)

    const [remainingCharacters, setReaminingCharacters] = useState(MAX_CHAR);

    const [postText,setPostText] = useState("")

    const user = useRecoilValue(userAtom)

    const handleTextChange = async (e)=>{
        const inputText = e.target.value;

        if(inputText.length > MAX_CHAR){
            const truncatedText = inputText.slice(0,MAX_CHAR)
            setPostText(truncatedText);
            setReaminingCharacters(0)
        }
        else{
            setPostText(inputText)
            setReaminingCharacters(MAX_CHAR - inputText.length)
        }
    }

    const handleCreatePost = async ()=>{
        if(postText == "" || null){
            return showToast("Error","Please Enter some description or text","error")
        }
        setLoading(true)
        try {
            
            const res = await fetch("/api/posts/create",{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({postedBy:user._id, text:postText, img:imgUrl})
            })
            console.log({ postedBy: user._id, text: postText, img: imgUrl });
    
            const data = await res.json()
    
            if(data.error){
                showToast("Error",data.error,"error")
                return
            }
            showToast("Success","Post Created successfully","success")
            if(username === user.username){
                setPosts([data,...posts]);
            }
            onClose();
            setPostText("")
            setImgUrl("")
        } catch (error) {
            showToast("Error",error,"error")
        }
        finally{
            setLoading(false)
        }


    }

  return (
   <>

   <Button position={'fixed'}
   bottom={10}
   right={10}
   onClick={onOpen}
   size={{base:'sm' , sm:"md"}}
   bg={useColorModeValue("gray.300","gra.dark")}>
    <AddIcon/>
   </Button>
   <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
             <FormControl>

                <Textarea
                placeholder='Post content goes here' onChange={handleTextChange} value={postText}/>
                <Text fontSize={'xs'} fontWeight={'bold'} textAlign={'right'}
                m={"1"} color={"gray.800"}>
                    {remainingCharacters}/{MAX_CHAR}
                </Text>

                <Input type="file" hidden ref={imageRef} onChange={handleImageChange}/>

                <BsFillImageFill style={{margin:"5px",cursor:"pointer"}} size={16} onClick={()=> imageRef.current.click()}/>


             </FormControl>

             {imgUrl && (
                <Flex mt={5} w={'full'}position={'relative'}>
                    <Image src={imgUrl} alt='Select Img'/>
                    <CloseButton onClick={()=> {
                        setImgUrl("")
                    }}
                    bg={'gray.800'} position={'absolute'} top={2} right={2}/>

                </Flex>
             )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>

   </>
  )
}

export default CreatePost