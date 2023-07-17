import React, { useState, useRef, useEffect } from 'react';
import { Platform, Dimensions, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { w16, w24, w28, w32, w48, w64, w96, androidHeader, iosHeader } from '../utils/theme'

const ChatBot = () => {
  const [messages, setMessages] = useState([{ id: 1, text: '안녕하세요', sender: 'bot' }]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = async () => {
    try {
      const message = { id: Date.now(), text: inputText, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, message]);
      setInputText('');
      
      const res = await axios.post('http://ec2-43-201-149-19.ap-northeast-2.compute.amazonaws.com/api/user/api/chat/send/', {
        input_text: inputText
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      res_message = { id: Date.now(), text: res.data.message, sender: 'bot' };
      // response 처리, message에 저장
      // const res = { id: Date.now() + 1, text: Platform.OS, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, res_message]);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSend = () => {
  //   const url = 'http://ec2-43-201-149-19.ap-northeast-2.compute.amazonaws.com/api/user/api/chat/send/';
  //   const data = new URLSearchParams();
  //   data.append('input_text', 'dddd');
    
  //   axios.post(url, data, {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }})
  //     .then(response => {
  //       console.log(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error:', error);
  //     });
  // }

  const handleImage = async () => {
    try {
      const userID = 'admin';
      const userPW = '1234';
      const res = await axios.get('https://...', {
        id: userID,
        pw: userPW
      })
      setMessages((prevMessages) => [...prevMessages, res]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVoice = async () => {

  };

  return (
    <Container>
      <Header />

      <MessagesOuterContainer>
        <MessagesContainer
          ref={scrollViewRef}
        >
            {messages.map((message) => (
              <MessageContent key={message.id} sender={message.sender}>
                {message.sender === 'bot' && (
                  <BotProfile>
                    <Logo source={require('../assets/logo-small.png')} />
                  </BotProfile>
                )}
                <Message key={message.id} sender={message.sender}>
                  <MessageText>{message.text}</MessageText>
                </Message>
              </MessageContent>
            ))}
        </MessagesContainer>
      </MessagesOuterContainer>

      <InputContainer>
          <Input
            value={inputText}
            multiline={true}
            onChangeText={setInputText}
          />
          {inputText ? (
            <Button onPress={handleSend}>
              <Icon source={require('../assets/send-icon.png')} />
            </Button>
          ) : (
            <>
              <Button onPress={handleImage}>
                <Icon source={require('../assets/image-icon.png')} />
              </Button>
              <Button onPress={handleVoice}>
                <Icon source={require('../assets/mic-icon.png')} />
              </Button>
            </>
          )}
      </InputContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`

const Header = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.secondaryBackground, theme.primaryBackground],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  height: ${Platform.OS === 'android' ? androidHeader : iosHeader }px;
  padding-top: ${Platform.OS === 'android' ? w96 : 0}px;
`

const MessagesOuterContainer = styled.View`
  flex: 1;
  padding-bottom: ${w28}px;
`

const MessagesContainer = styled.ScrollView`
  flex: 1;
  padding: ${w28}px ${w28}px;
`

const MessageContent = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: ${props => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
  margin-bottom: ${w28}px;
`

const BotProfile = styled.View`
  width: ${w96}px;
  height: ${w96}px;
  margin-right: ${w28}px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.secondary};
  justify-content: center;
  align-items: center;
`

const Logo = styled.Image`
  width: ${w64}px;
  height: ${w64}px;
`

const Message = styled.View`
  background-color: ${({ theme, sender }) => (sender === 'user' ? theme.primary : theme.secondary)};
  border-radius: ${w48}px;
  padding: ${w24}px ${w28}px;
  max-width: ${({ sender }) => (sender === 'user' ? 66.7 : 58.5)}%;
  min-width: ${w96}px;
`

const MessageText = styled.Text`
  color: white;
  font-size: 16px;
`

const InputContainer = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.secondaryBackground, theme.primaryBackground],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`

  flex-direction: row;
  align-items: center;
  margin: 0 ${w32}px ${w28}px ${w28}px;
  padding: ${w16}px;
  padding-right: ${w28}px;
  border-radius: 24px;
`

const Input = styled(TextInput).attrs(({ theme }) => ({
  cursorColor: theme.secondaryBackground,
  selectionColor: theme.secondaryBackground
}))`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  border-radius: 20px;
  padding: ${w16}px ${w48}px;
  font-size: 16px;
`

const Button = styled.TouchableOpacity`
  width: ${w96}px;
  height: ${w96}px;
  margin-left: ${w16}px;
  padding: ${w16}px;
`

const Icon = styled.Image`
  width: 100%;
  height: 100%;
`

export default ChatBot