import Head from "next/head";
import styled from "styled-components";
import {Button} from "@mui/material";
import {auth, provider} from "../firebase";
import { signInWithPopup } from "firebase/auth"

function LoginPage() {

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider)
  }

  return (
    <Container>
      <Head>
        <title>login</title>
      </Head>
      <LoginContainer>
        <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
        <Button onClick={signIn} variant={'outlined'}>Sign in with Google</Button>
      </LoginContainer>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0,0,0, 0.2);
`;

const Logo = styled.img`
  margin-bottom: 30px;
  height: 200px;
  width: 200px;
`;

export default LoginPage;