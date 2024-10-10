import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast
  } from '@chakra-ui/react';
  import React from 'react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import { useSetRecoilState } from 'recoil';
  import authScreenAtom from '../../atom/authAtom';
import userAtom from '../../atom/userAtom';
import useShowToast from '../../hooks/useShowToast';
  
  export default function SignupCard() {
    const [showPassword, setShowPassword] = useState(false);

    const [loading,setLoading]=useState(false)


    const showToast = useShowToast();

// state management
    const setAuthScreenState = useSetRecoilState(authScreenAtom);

    const setUser = useSetRecoilState(userAtom)



    const toast = useToast();
  
    const [inputs, setInputs] = useState({
      name: "",
      username: "",
      email: "",
      password: "",
    });
  
    const handleSignUp = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs)
        });
  
        const data = await res.json();
        if (data.error) {
          showToast("Error",data.error,"Error")
          return;
        }
  
        localStorage.setItem("user-threads", JSON.stringify(data));
        setUser(data)
        
      } catch (error) {
       showToast("Error",error,"error")
        console.log(error);
      }
      finally{
        setLoading(false)
      }
    };
  
    return (
      <Flex align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('gray.light', 'gray.dark')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <Heading fontSize={'4xl'} mb={4} mt={4} textAlign={'center'}>
                Sign up
              </Heading>
              <HStack>
                <Box>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input type="text" onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                      value={inputs.name} />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input type="text" onChange={(e) => setInputs({ ...inputs, username: e.target.value })} value={inputs.username} />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" onChange={(e) => setInputs({ ...inputs, email: e.target.value })} value={inputs.email} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} value={inputs.password} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bg={useColorModeValue('gray.600', 'gray.700')}
                  color={'white'}
                  onClick={handleSignUp}
                  _hover={{
                    bg: useColorModeValue('gray.700', "gray.800"),
                  }} isLoading={loading}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link color={'blue.400'} onClick={() => setAuthScreenState("login")}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
  