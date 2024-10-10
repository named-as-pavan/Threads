import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../../atom/authAtom'
import useShowToast from '../../hooks/useShowToast';
import { useState } from 'react';
import userAtom from '../../atom/userAtom'
import React from 'react';

export default function LoginCard() {
  const [loading,setLoading]=useState(false)

  const showToast = useShowToast();


  const setUser = useSetRecoilState(userAtom)

  const [inputs,setInputs] = useState({

    username:"",
    password:"",
  })





  const setAuthScreenState = useSetRecoilState(authScreenAtom)

  const handleLogin = async () => {
    try {
        setLoading(true);
        const res = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
        });

        const data = await res.json();

        if (!res.ok) {
            showToast("Error", data.error || "An unknown error occurred", "error");
            return;
        }
        localStorage.setItem("user-threads", JSON.stringify(data));
        setUser(data);
    } catch (error) {
        showToast("Error", "An error occurred while logging in", "error");
        console.error("Login error:", error); // Log the error to console for debugging
    } finally {
        setLoading(false);
    }
};

  return (
    <Flex
      align={'center'}
      justify={'center'}
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('gray.light', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
          w={{
            base:'full',
            sm:"400px"
          }}>
          <Stack spacing={4}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Login</Heading>
        </Stack>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" onChange={(e)=> setInputs((inputs)=>  ({...inputs,username:e.target.value}))} value={inputs.username} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" onChange= {(e)=> setInputs((inputs)=>  ({...inputs,password:e.target.value}))} value={inputs.password} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text color={'blue.400'}>Forgot password?</Text>
              </Stack>
              <Button
               bg={useColorModeValue('gray.600','gray.700')}
               loadingText="Loging in"
               color={'white'}
               _hover={{
                 bg: useColorModeValue('grau.700',"gray.800"),
               }} onClick={handleLogin} isLoading={loading}>
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
                <Text align={'center'}>
                  Don't have account? <Link color={'blue.400'} onClick={()=> setAuthScreenState("signup")}>Sign up</Link>
                </Text>
              </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}