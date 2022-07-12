import styled from "styled-components";
import {Avatar} from "@mui/material";
import {getRecipientEmail} from "../utils/getRecipientEmail";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {collection, doc, getDocs, orderBy, query, where} from "firebase/firestore";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {useRouter} from "next/router";

export const Chat = ({ id, users}) => {

  const router = useRouter()
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  // create a reference to the DB...
  const recipientRef = query(
    collection(db, 'users'),
    where('email', '==', recipientEmail)
  )
  const msgRef = query(
    collection(db, `/chats/${id}/messages`),
    orderBy('timestamp', 'asc')
  )
  const [msgSnap] = useCollection(msgRef)
  const messages = msgSnap?.docs.map(message => ({
    id: message.id,
    ...message.data()
  }))
  console.log(messages)
  // creating the collection...
  const [recipientSnapshot] = useCollection(recipientRef)
  // get user from collection...
  const recipient = recipientSnapshot?.docs[0]

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  return <Container onClick={enterChat}>
    {recipient ? (
        <UserAvatar src={recipient.data().photoURL}/>
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
          )}
    <UserInfo>
      <p>{recipientEmail}</p>
      <LastMessage>
        {messages ? <i>{messages[messages.length - 1].message}</i> : <i>Loading...</i>}
      </LastMessage>
    </UserInfo>
    </Container>
}

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
  
`;

const LastMessage = styled.div`
  color: gray;
`

const UserAvatar = styled(Avatar)`
  margin: 5px;
`;

const UserInfo = styled.div`
  margin-left: 10px;
  p {
    margin: 0 auto;
    font-weight: 500;
  }
  
`



