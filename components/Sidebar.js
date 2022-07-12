import styled from "styled-components";
import {Avatar, Button, IconButton} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from "email-validator";
import { signOut } from "firebase/auth"
import {auth, db} from "../firebase";
import {addDoc, collection, doc, query, setDoc, where} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import {Chat} from "./Chat";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export const Sidebar = () => {

  const [user] = useAuthState(auth);
  const userChatRef = query(
    collection(db, 'chats'),
    where('users', 'array-contains', user.email)
  )

  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = async () => {
    const input = prompt(
      "Enter the email of your friend..."
    )
    if (!input) return null;
    if(EmailValidator.validate(input) && input !== user.email) {
      // We need to add the chat into th DB
      const chatSnap = doc(collection(db, 'chats'))
      await setDoc(chatSnap, {
        users: [user.email, input],
      });
    }
  }
  // we check if our chat is exists in firestore...
  const chatAlreadyExists = (recipientEmail) => {
    console.log(chatsSnapshot.docs)
    !!chatsSnapshot.docs.find(chat => chat.data().users.find((user) => user === recipientEmail).length > 0)
  }

        return (
            <Container>
                <Header>
                  <UserAvatar src={user.photoURL} onClick={() => signOut(auth)}/>
                  <IconsContainer>
                    <IconButton>
                      <ChatIcon />
                    </IconButton>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </IconsContainer>
                </Header>
                <Search>
                  <SearchIcon/>
                  <SearchInput placeholder={'Search in chat'}/>
                </Search>
                <SidebarButton onClick={createChat}>
                  <p>Start a new chat</p>
                  <SidebarButtonIcon />
                </SidebarButton>

              {
                chatsSnapshot?.docs.map(chat => (
                  <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                ))
              }

            </Container>
        )
}

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  
  ::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  height: 80px;
  background-color: #fff;
  z-index: 1;
  justify-content: space-between;
`;

const UserAvatar = styled(Avatar)`
  margin: 10px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  padding: 20px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  column-gap: 2px;
`;

const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  p {
    @media (max-width: 768px) {
      //display: none;
    }
  }
    
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    color: #000;
    font-weight: 500;
  }
`;

const SidebarButtonIcon = styled(PersonSearchIcon)`
  @media (min-width: 768px) {
    //display: none;
  }
`