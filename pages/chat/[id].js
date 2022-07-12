import styled from "styled-components";
import Head from "next/head";
import {Sidebar} from "../../components/Sidebar";
import {ChatScreen} from "../../components/ChatScreen";
import {collection, query, orderBy, getDocs, getDoc, doc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {useRouter} from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {getRecipientEmail} from "../../utils/getRecipientEmail";


function ChatPage ({ chat, messages }) {

  const [user] = useAuthState(auth);

  // console.log('chat')
  console.log(chat)
  // console.log('messages')
  console.log(JSON.parse(messages))

  return <Container>
    <Head>
      <title>Chat with {getRecipientEmail(chat.users, user)}</title>
    </Head>
    <Responsive>
      <Sidebar/>
    </Responsive>
    <ChatContainer>
      <ChatScreen messages={messages} chat={chat}/>
    </ChatContainer>
  </Container>
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
`;
const Responsive = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
export default ChatPage;

export async function getServerSideProps(context) {

  const messagesRef = collection(db, `chats/${context.query.id}/messages`)
  const chatRef = doc(db, 'chats', `${context.query.id}`)

  const messagesSnap = await getDocs(query(messagesRef, orderBy("timestamp", "asc")))
  const chatSnap = await getDoc(chatRef)

  const messages = messagesSnap.docs.map(message => ({
    id: message.id,
    ...message.data()
  }))
  const chat = {
    id: chatSnap.id,
    ...chatSnap.data()
  }

  // console.log(JSON.stringify(messages))
  // console.log(chat)

  return {
    props: {
      chat: chat,
      messages: JSON.stringify(messages)
    }
  }
}
