import styled from "styled-components";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {useRouter} from "next/router";
import {Avatar, IconButton} from "@mui/material";
import {AttachFile, InsertEmoticon, Mic, MoreVert} from "@mui/icons-material";
import {useCollection,} from "react-firebase-hooks/firestore";
import {addDoc, collection, doc, getDoc, orderBy, query, serverTimestamp, updateDoc, where} from "firebase/firestore";
import {Message} from "./Message";
import {useRef, useState} from "react";
import {getRecipientEmail} from "../utils/getRecipientEmail";
import {TimeAgo} from "./TimeAgo";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export const ChatScreen = ({ messages, chat }) => {

  const [user] = useAuthState(auth);
  const [input, setInput] = useState('')
  const router = useRouter();
  const endOfMessagesRef = useRef(null)
  const messagesRef = collection(db, `chats/${router.query.id}/messages`,)
  const [messagesSnapshot] = useCollection(query(messagesRef, orderBy("timestamp", "asc")))
  const [recipientSnapshot] = useCollection(
    query(
      collection(
        db, 'users'
      ), where("email", "==", getRecipientEmail(chat.users, user))
    )
  )

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    // update the last seen...
    await updateDoc(doc(db, 'users', user.uid), {
      lastSeen: serverTimestamp()
    })

    await addDoc(collection(db, `chats/${router.query.id}`, 'messages'), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    })

    setInput('');
    scrollToBottom()
  }

  const backToChats = () => {
    router.push('/');
  }

  const showMessages = () => {
    if( messagesSnapshot) {
      return messagesSnapshot.docs.map(
        (message) => (
          <Message
            key={message.id}
            user={message.data().user}
            message={message.data().message}
            timestamp={message.data().timestamp?.toDate()}
          />
        )
      )
    } else {
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={message.message}
          timestamp={null}
        />
      ))
    }
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return <Container>
    <Header>
      <IconButton>
        <BackIcon onClick={backToChats}/>
      </IconButton>
      {recipient
        ? (
          <Avatar src={recipient?.photoURL}/>
        )
        : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
      <HeaderInformation>
        <h3>{recipientEmail}</h3>
        {recipientSnapshot ? (
          <p>
            Last active: {" "}
            {recipient?.lastSeen?.toDate()? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ) : (
              "Unavailable"
            )}
          </p>
          )
          : (
            <p>Loading Last active...</p>
          )}
      </HeaderInformation>
      <HeaderIcons>
        <IconButton>
          <AttachFile />
        </IconButton>
        <IconButton>
          <MoreVert/>
        </IconButton>
      </HeaderIcons>
    </Header>
    <MessagesContainer>
    {/*  show messages */}
      {showMessages()}
      <EndOfMessages ref={endOfMessagesRef}/>
    </MessagesContainer>
    <InputContainer>
      <InsertEmoticon/>
      <Input value={input} onChange={e => setInput(e.target.value)} placeholder={'input text here...'}/>
      <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
      <Mic />
    </InputContainer>
  </Container>
}

const Container = styled.div`
  
`;

const BackIcon = styled(ArrowBackIosNewIcon)`
  @media (min-width: 769px) {
    display: none;
  }
`

const Input = styled.input`
  padding: 10px;
  min-height: 50px;
  margin-left: 15px;
  flex: 1;
  outline: 0;
  align-items: center;
  position: sticky;
  bottom: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  z-index: 100;
`;


const Header = styled.div`
  padding: 11px;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid whitesmoke;
  display: flex;
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
  @media (max-width: 768px) {
    h3 {
      font-size: 14px;
    }
    p {
      margin: 2px 0;
    }
  }
`;

const HeaderIcons = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MessagesContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 15px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
  border: none;
  outline: none;
`;


const EndOfMessages = styled.div`
  margin-bottom: 50px
`;