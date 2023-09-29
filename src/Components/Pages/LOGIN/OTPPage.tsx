import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import useCountdown from "./useCoundown";
import { MdDoneOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

const verifyOTP = async ({ data, otp }: { data: string; otp: string }) => {
  console.log("response OTP:", otp);

  try {
    const response = await axios.post("https://agreeable-calf-coat.cyclic.cloud/user/verify-login", {
      data,
      otp,
    });

    console.log(response);

    if (!response.data.token) {
      throw new Error("Invalid OTP");
    }

    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

const OTPPage = () => {
  interface UserData {
    email: string;
    phoneNumber: string;
    message:string;
  }
  
  const users: UserData = JSON.parse(localStorage.getItem("userData") || '{}') || { email: "", phoneNumber: "" };



  const [otp, setOTP] = useState("");
  const { seconds, reset, active } = useCountdown(60);
  const navigate = useNavigate();
  const toast = useToast();
  const [response, setResponse] = useState<string | undefined>();
  const isOtpValid = (/^\d{6}$/.test(otp) && otp.length) === 6;

  const otpVerificationMutation = useMutation(verifyOTP);

  useEffect(() => {
    if (seconds === 60) {
    }

    if (otpVerificationMutation.isError) {
      setResponse("Invalid Credential");
    } else if (otpVerificationMutation.isSuccess) {
      setResponse(
        "OTP sent Successfully, Please check your messages for OTP."
      );
    }
  }, [otpVerificationMutation.isError, otpVerificationMutation.isSuccess]);

  const goBack = () => {
    window.history.back();
  };

  const goToHome = () => {
    console.log(isOtpValid)
    if (isOtpValid) {
      console.log("otp:",otp);
      otpVerificationMutation.mutateAsync({ data: users.email, otp }).then(
        (res) => {
          toast({
            position: "bottom",
            render: () => (
              <Flex alignItems={"center"} gap={"4"} color="white" p={3} bg="#38a169">
                <MdDoneOutline  />
                <Box>
                  <Text fontSize={"xl"}>Login</Text>
                  <Text>Login Successfully!</Text>
                </Box>
              </Flex>
            ),
          });
          navigate("/");
        },
        (error) => {
          setResponse(error.message);
        }
      );
    }
  };

  const resendFunction = () => {
    reset();
  };

  const handleOTP = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOTP(e.target.value);
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
      bgImage={`
        url('https://sso.masaischool.com/screenbg.svg'), 
        url('https://sso.masaischool.com/screenbg-bottom.svg')
      `}
      bgPosition="left top, right bottom"
      bgRepeat="no-repeat"
      bgSize="50%, 35%"
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign="center"
        mt={"2rem"}
      >
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
        gap={"10px"}
      >
        <Text
          w={"100%"}
          as="h1"
          fontWeight={600}
          fontFamily={"sans-serif"}
          lineHeight={"1.75rem"}
          fontSize={"1.25rem"}
          textAlign={"center"}
        >
          Sign In
        </Text>
        <Box mt={2} w={"100%"} p={"1rem"}>
          <FormControl w={"100%"} mt={1}>
            <FormLabel
              color={"#626568"}
              lineHeight={"1.25rem"}
              fontSize={"1rem"}
              fontWeight={600}
            >
              Enter OTP{" "}
              {users.message ===
              "Verification code sent successfully to email."
                ? `From ${users.email}`
                : `from  ${users.phoneNumber}`}
            </FormLabel>

            <Flex
              w={"100%"}
              flexDirection={["column", "column", "row", "row"]}
              gap={["10px", "10px", "10px", "20px"]}
              textAlign={["initial", "initial", null,null]}
              justifyContent={"space-between"}
              alignItems={"flex-start"}
              fontSize={"0.95rem"}
            >
              <Text color={"#2563eb"} onClick={goBack} cursor={"pointer"}>
                or change phone number
              </Text>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                fontSize={"0.95rem"}
              >
                <Button
                  display={!active ? "block" : "none"}
                  fontSize={"0.95rem"}
                  p={1}
                  bg="transparent"
                  color={"#2563eb"}
                  onClick={resendFunction}
                >
                  Resend OTP
                </Button>
                <Text display={!active ? "none" : "block"}>
                  Resend OTP in {seconds} sec
                </Text>
              </Flex>
            </Flex>
            <Input
              placeholder="Enter 6 Digit OTP"
              fontSize={"1rem"}
              padding={"1.2rem 0.75rem"}
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
              onChange={handleOTP}
            />

            <Text
              fontSize={"0.9rem"}
              mt={2}
              textAlign={"justify"}
              color={response === "Invalid Credential" ? "red" : "#6c6c85"}
            >
              {response}
            </Text>
          </FormControl>
          <Button
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width="100%"
            mt={"1rem"}
            size={"md"}
            fontSize={"1.05rem"}
            isDisabled={!isOtpValid}
            bgColor={"#2563eb"}
            color={"white"}
            _hover={{
              bgColor: "#2563eb",
              color: "white",
            }}
            onClick={goToHome}
          >
            SIGN IN
          </Button>
        </Box>

        <Text color={"#878894"} textAlign="center" fontSize={"1rem"}>
          Don't have an account?
          <Text
            as={"a"}
            href="/login"
            _hover={{
              textDecoration: "none",
            }}
            color={"#2563eb"}
            cursor={"pointer"}
            fontWeight={600}
          >
            {" "}
            Sign up
          </Text>
        </Text>
      </Box>

      <Text
        w={"100%"}
        display={["none", "none", "block", "block"]}
        bottom="0"
        m={"auto"}
        color={"#9ca9b7"}
        position={"absolute"}
        fontWeight={400}
        textAlign={"center"}
      >
        © 2023 by Masai School Privacy Policy & Terms and Conditions
      </Text>
    </Box>
  );
};

export default OTPPage;
