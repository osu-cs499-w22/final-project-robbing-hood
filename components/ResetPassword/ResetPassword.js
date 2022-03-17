import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from 'react';

function ResetPassword() {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submitHandler(e) {
    e.preventDefault();

    // Validation
    if (!email || !email.includes('@')) {
      setIsEmailError(true);
    } else {
      setIsEmailError(false);
    }

    if (!newPassword) {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }

    if (isEmailError || isPasswordError) {
      return;
    }

    const response = await fetch('/api/users/resetpassword', {
      method: 'PATCH',
      body: JSON.stringify({ email, newPassword }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    console.log(data);
  
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <form onSubmit={submitHandler}>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Enter new password
          </Heading>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <FormErrorMessage>Invalid email address.</FormErrorMessage>
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>Invalid password.</FormErrorMessage>
          </FormControl>
          <Stack spacing={6}>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
}

export default ResetPassword;
