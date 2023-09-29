import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Image,
  useToast,
  Flex,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { MdDoneOutline } from "react-icons/md";
import { useMutation } from 'react-query';

interface LoginProps {}
export const loginUser = async (userData:object) => {

  const response = await fetch(`https://agreeable-calf-coat.cyclic.cloud/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  return data;
};  

const Login: React.FC<LoginProps> = () => {

  const toast = useToast();
  const loginMutation = useMutation(loginUser);
  
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const validateInput = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const isEmail = emailRegex.test(value);
    const isPhoneNumber = /^\d{10}$/.test(value);

    setIsValid(isEmail || isPhoneNumber);
  };

  const navigate = useNavigate();

 

  const submitFunction = async () => {
    if (isValid) {
      try {
       
        const response = await loginMutation.mutateAsync({ data: inputValue });

        console.log(response);
        if (response) {
          // Store user data in local storage
          localStorage.setItem("userData", JSON.stringify(response));
          navigate("/otp");
        }

        toast({
          position: "bottom",
          render: () => (
            <Flex alignItems="center" gap="4" color="white" p={3} bg="#38a169">
              <MdDoneOutline />
              <Box>
                <Text fontSize="xl">OTP</Text>
                <Text>OTP sent Successfully!</Text>
              </Box>
            </Flex>
          ),
        });
        
      } catch (error) {
        console.error("Login Error:", error);
       
        toast({
          position: "bottom",
          render: () => (
            <Flex alignItems="center" gap="4" color="white" p={3} bg="red">
              {/* Add an error icon */}
              <Box>
                <Text fontSize="xl">Error</Text>
                <Text>Login failed. Please try again.</Text>
              </Box>
            </Flex>
          ),
        });
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueAdd = e.target.value;
    setInputValue(valueAdd);
    validateInput(valueAdd);

    if (
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(valueAdd) ||
      /^\d{10}$/.test(valueAdd)
    ) {
      setMessage("");
    } else if (/^\d+$/.test(valueAdd)) {
      setMessage("Please Enter Valid Phone Number");
    } else if (/[a-zA-Z]/.test(valueAdd)) {
      setMessage("Please Enter Valid Email Address");
    } else {
      setMessage("");
    }
  };

  return (
    <Box
    minHeight="100vh"
    width="100vw"
    m={"auto"}
    display="flex"
    flexDirection={"column"}
    alignItems="center"
    justifyContent="space-between"
    gap={"30px"}
    bgImage={`
        url('https://sso.masaischool.com/screenbg.svg'), 
        url('https://sso.masaischool.com/screenbg-bottom.svg')
      `}
    bgPosition="left top, right bottom"
    bgRepeat="no-repeat"
    bgSize="50%, 35%">
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign="center"
      mt={"2.5rem"}>
      <Image h={"62px"} src="https://sso.masaischool.com/brand_dark.svg" />
    </Box>
    <Box
      width={["100%", "70%", "55%", "33%"]}
      p={4}
      pb={"2rem"}
      lineHeight={"1.75rem"}
      m={"auto"}
      boxShadow={[
        "",
        "",
        "0px 0px 25px -5px rgba(0,0,0,0.1),0px 20px 25px -5px rgba(0,0,0,0.1),0px 0px 10px -5px rgba(0,0,0,0.04)",
        "0px 0px 25px -5px rgba(0,0,0,0.1),0px 20px 25px -5px rgba(0,0,0,0.1),0px 0px 10px -5px rgba(0,0,0,0.04)",
      ]}
      borderRadius={"15px"}
      display="flex"
      flexDirection={"column"}
      justifyContent="space-around"
      alignItems="center"
      gap={"10px"}>
      <Text
        w={"100%"}
        as="h1"
        fontWeight={600}
        fontFamily={"sans-serif"}
        lineHeight={"1.75rem"}
        fontSize={"1.25rem"}
        textAlign={"center"}>
        Sign In
      </Text>
      <Box mt={2} w={"100%"} p={"1rem"}>
        <FormControl w={"100%"} mt={1}>
          <FormLabel
            color={"#626568"}
            lineHeight={"1.25rem"}
            fontSize={"0.88rem"}
            fontWeight={600}>
            Phone number or email address
          </FormLabel>
          <Input
            placeholder="Enter Phone number or email address"
            fontSize={"1rem"}
            value={inputValue}
            padding={"1rem 0.75rem"}
            _focus={{
              borderColor: ["#F3B308", "#F3B308", "#F3B308", "black"],
              boxShadow: [
                "0 0 0 1px #F3B308",
                "0 0 0 1px #F3B308",
                "0 0 0 1px #F3B308",
                "0 0 0 1px black",
              ],
            }}
            _placeholder={{ color: "#d1d5db" }}
            onChange={(e) => {
              handleInput(e);
            }}
          />
          {message && (
            <Text
              textAlign={"justify"}
              fontWeight={500}
              fontSize={"1rem"}
              color="red.500"
              mt={1}>
              {message}
            </Text>
          )}
        </FormControl>
        <br />

        <Button
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width="100%"
          mt={"1.5rem"}
          fontSize={"1rem"}
          isLoading={loginMutation.isLoading}
          isDisabled={!isValid || loginMutation.isLoading}
          bgColor={"#2563eb"}
          color={"white"}
          _hover={{
            bgColor: "#2563eb",
            color: "white",
          }}
       
          onClick={submitFunction}>
          CONTINUE
        </Button>
      </Box>

      <Text color={"#878894"} textAlign="center" fontSize={"1rem"} mt={2}>
        Don't have an account?
        <Text
          as={"a"}
          color={"#2563eb"}
          href="/signup"
          _hover={{
            textDecoration: "none",
          }}
          cursor={"pointer"}
          fontWeight={600}>
          {" "}
          Sign Up
        </Text>
      </Text>
    </Box>
    <Box visibility={"hidden"}> </Box>
    <Text
      w={"100%"}
      display={["none", "none", "block", "block"]}
      bottom="0"
      m={"auto"}
      color={"#9ca9b7"}
      fontSize={"1.05rem"}
      fontWeight={400}
      mt={2}
      textAlign={"center"}>
      © 2023 by Masai School Privacy Policy & Terms and Conditions
    </Text>
  </Box>
  );
};

export default Login;
