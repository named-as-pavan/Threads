import { Avatar, Box, Flex, Image, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Actions from '../components/Actions';
import { Menu, MenuButton, MenuItem, MenuList, Portal } from '@chakra-ui/react';

const UserPost = ({ postImg, postTitle, likes, replies }) => {
    const [liked, setLiked] = useState(false);
    const toast = useToast();

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

    return (
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={'column'} alignItems={'center'}>
                <Avatar name='Mark Zuckerberg' src='/post1.png' size={'md'} />
                <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                <Box position={'relative'} w={'full'}>
                    <Avatar
                        size={'xs'}
                        name='john'
                        src='https://bit.ly/kent-c-dodds'
                        position={'absolute'}
                        top={'0px'}
                        left={'15px'}
                        padding={'2px'}
                    />
                    <Avatar
                        size={'xs'}
                        name='john'
                        src='https://bit.ly/kent-c-dodds'
                        position={'absolute'}
                        bottom={'0px'}
                        right={'-5px'}
                        padding={'2px'}
                    />
                    <Avatar
                        size={'xs'}
                        name='john'
                        src='https://bit.ly/kent-c-dodds'
                        position={'absolute'}
                        bottom={'0px'}
                        left={'4px'}
                        padding={'2px'}
                    />
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex w={'full'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>mark antony</Text>
                        <Image src='/verified.png' w={4} h={4} ml={1} />
                    </Flex>
                    <Flex gap={4} alignItems={'center'}>
                        <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
                        <Menu>
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
                        </Menu>
                    </Flex>
                </Flex>
                <Link to={'/markzuckerburg/post/1'}>
                    <Text fontSize={'sm'}>{postTitle}</Text>
                    {postImg && (
                        <Box
                            borderRadius={6}
                            overflow={'hidden'}
                            border={'1px solid'}
                            borderColor={'gray.light'}
                        >
                            <Image src={postImg} w={'full'}></Image>
                        </Box>
                    )}
                </Link>
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked} />
                </Flex>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>123 {likes} likes</Text>
                    <Box w={0.5} h={0.5} borderRadius={'full'} bg={"gray.light"}></Box>
                    <Text fontSize={'sm'} color={'gray.light'}>{replies} replies</Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default UserPost;
