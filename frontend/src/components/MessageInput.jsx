import { Flex, Input, InputGroup, InputRightElement, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import useShowToast from '../../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../../atom/messagesAtom'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, Avatar } from '@chakra-ui/react';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../../hooks/usePreviewImg'



const MessageInput = ({ setMessages }) => {

    const [messageText, setMessageText] = useState("")
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);

    const { handleImageChange ,imgUrl,setImgUrl } = usePreviewImg();
    const [isSending,setIsSending] = useState(false)

    const [conversations, setConversations] = useRecoilState(conversationsAtom);

    const imageRef = useRef(null)

    const { onClose } = useDisclosure()

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText && !imgUrl) return;
        if(isSending) return;

        setIsSending(true)

        try {

            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                    img:imgUrl,
                })

            })
            if (!res.ok) {
                const errorData = await res.json();
                showToast("Error", errorData.error || "An unexpected error occurred", "error");
                return;
            }


            const data = await res.json();

            if (data.error) {
                showToast("Error", error.message, "error")
                return
            }
            setMessageText("")
            setMessages((messages) => [...messages, data])
            setConversations(prevConvc => {
                const updatedConversation = prevConvc.map(conversation => {
                    if (conversation._id === selectedConversation._id) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: messageText,
                                sender: data.sender
                            }
                        }
                    }
                    return conversation;
                })
                return updatedConversation;
            })
            setMessageText("")
            setImgUrl("")

        } catch (error) {
            showToast("Error", error.message, "error")
        }
        finally{
            setIsSending(false)
        }

    }



    return (
        <Flex gap={2} alignItems={'center'}>

            <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
                <InputGroup>
                    <Input w={'full'} placeholder='Type a message' onChange={(e) => setMessageText(e.target.value)} value={messageText} />
                    <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
                        <IoSendSharp />
                    </InputRightElement>
                </InputGroup>
            </form>
            <Flex flex={5} cursor="pointer">
                <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
                <input type="file" hidden ref={imageRef} onChange={handleImageChange}/>
            </Flex>

             <Modal isOpen={imgUrl} onClose={()=>{
                onClose();
                setImgUrl("")
             }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload Image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex mt={5} w="full">
                            <Image
                                src={imgUrl}
                                alt="Uploaded image"
                                w="full"
                            />
                        </Flex>
                        <Flex justifyContent="flex-end" my={2}>
                            {!isSending ?(
                                                            <IoSendSharp size={24} cursor="pointer" onClick={handleSendMessage}/>

                            ):(
                                <Spinner size={'sm'}/>
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal> 

        </Flex>
    )
}

export default MessageInput