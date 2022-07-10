import styled from "styled-components";
import {Avatar} from "@mui/material";
import {getRecipientEmail} from "../utils/getRecipientEmail";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {collection, query, where} from "firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
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
  // creating the collection...
  const [recipientSnapshot] = useCollection(recipientRef)
  // get user from collection...
  const recipient = recipientSnapshot?.docs[0]

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  return <Container onClick={enterChat}>
    {recipient ? (
        <UserAvatar src={recipient?.photoURL}/>
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
          )}
    <UserEmail>
      {recipientEmail}
    </UserEmail>
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

const UserAvatar = styled(Avatar)`
  margin: 5px;
`;
const UserEmail = styled.p`
  @media (max-width: 768px) {
    display: none;
  }
`



