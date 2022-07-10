import styled from "styled-components";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import moment from "moment";

export const Message = ({ user, message, timestamp }) => {

  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver

  return <Container>
    <TypeOfMessage>
      {message}
      <Timestamp>
        {timestamp ? moment(message.timestamp).format('LT') : '...' }
      </Timestamp>
    </TypeOfMessage>
  </Container>
}

const Container = styled.div`
  
`;

const MessageElement = styled.p`
  padding: 15px 15px 26px 15px;
  margin: 10px;
  width: fit-content;
  border-radius: 8px;
  min-width: 60px;
  position: relative;
  text-align: right;
  @media (max-width: 768px) {
    padding: 7px;
    margin: 5px;
    margin-bottom: 20px;
    font-size: 12px;
  }
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.span`
  padding: 10px;
  color: gray;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
  @media (max-width: 768px) {
    bottom: -25px;
  }
`;