import React, { useState, useRef, useEffect, useContext } from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Context } from '../utils/Context';
import { w8, w16, w24, w28, w32, w48, w64, w96 } from '../utils/theme';
import Container from '../components/Container';
import Header from '../components/Header';
import Icon from '../components/Icon';
import { toast } from '../utils/toast';

const ChatBot = () => {
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState('');
	const [toastVisible, setToastVisible] = useState(false);
	const scrollViewRef = useRef(null);
	const { userId } = useContext(Context);

	useEffect(() => {
		loadChatLog();
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd();
		}
	};

	const loadChatLog = async () => {
		const res = await axios.get(`http://ec2-43-201-149-19.ap-northeast-2.compute.amazonaws.com/api/user/chat-messages/?user_id=${userId}`,
		{},
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		// console.log(res.data)
	}

	const handleSend = async () => {
		try {
			const message = {
				id: Date.now(),
				message: inputText,
				sender: 'user',
				created_at: new Date()
			};
			setMessages((prevMessages) => [...prevMessages, message]);
			setInputText('');
			
			const res = await axios.post('http://ec2-43-201-149-19.ap-northeast-2.compute.amazonaws.com/api/user/chat-messages/', {  
				id: userId,
				message: inputText
			}, {  
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			res_message = {
				id: Date.now(),
				message: res.data.chatbot_message,
				sender: 'bot',
				created_at: new Date()
			};
			setMessages((prevMessages) => [...prevMessages, res_message]);

		} catch (error) {
			toast('서버 접속이 원활하지 않습니다.')
		}
	};

	const handleImage = async () => {
		
	};

	return (
		<Container>
			<Header view='chatbot' />

			<MessagesContainer ref={scrollViewRef}>
				{messages.map((message, idx) => (
					<MessageContainer key={message.id}>
						{(idx === 0
							|| messages[idx - 1].created_at.getDate() !== message.created_at.getDate()
							) && (
							<DateSeparator>
								<DateSeparatorText>
									{message.created_at.getFullYear()}년 {message.created_at.getMonth()}월 {message.created_at.getDate()}일
								</DateSeparatorText>
							</DateSeparator>
						)}
						<MessageContent key={message.id} sender={message.sender}>
							{message.sender === 'bot' && (
								<BotProfile>
									<Logo source={require('../assets/logo-small.png')} />
								</BotProfile>
							)}
							<Message key={message.id} sender={message.sender}>
								<MessageText>{message.message}</MessageText>
							</Message>
						</MessageContent>
					</MessageContainer>
					
				))}
			</MessagesContainer>

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
					<Button onPress={handleImage}>
						<Icon source={require('../assets/image-icon.png')} />
					</Button>
				)}
			</InputContainer>
		</Container>
	);
};

const Test = styled.Text``

const MessagesContainer = styled.ScrollView`
	flex: 1;
	padding: ${w28}px ${w28}px ${w64}px;
`;

const MessageContainer = styled.View`
	flex: 1;
`

const DateSeparator = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: center;
`

const DateSeparatorText = styled.Text`
	padding: ${w8}px ${w64}px;
	border-radius: 100px;
	background-color: ${({ theme }) => theme.primaryBackground}80;
	color: ${({ theme }) => theme.background};
`


const MessageContent = styled.View`
	flex: 1;
	flex-direction: row;
	justify-content: ${props => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
	margin-bottom: ${w28}px;
`;

const BotProfile = styled.View`
	width: ${w96}px;
	height: ${w96}px;
	margin-right: ${w28}px;
	border-radius: 14px;
	background-color: ${({ theme }) => theme.secondary};
	justify-content: center;
	align-items: center;
`;

const Logo = styled.Image`
	width: ${w64}px;
	height: ${w64}px;
`;

const Message = styled.View`
	background-color: ${({ theme, sender }) => (sender === 'user' ? theme.primary : theme.secondary)};
	border-radius: ${w48}px;
	padding: ${w24}px ${w28}px;
	max-width: ${({ sender }) => (sender === 'user' ? 66.7 : 58.5)}%;
	min-width: ${w96}px;
`;

const MessageText = styled.Text`
	color: white;
	font-size: 16px;
`;

const InputContainer = styled(LinearGradient).attrs(({ theme }) => ({
	colors: [theme.secondaryBackground, theme.primaryBackground],
	start: { x: 0, y: 0 },
	end: { x: 1, y: 1 },
}))`
	flex-direction: row;
	align-items: center;
	margin: ${w28}px;
	margin-right: ${w32}px;
	padding: ${w16}px;
	padding-right: ${w28}px;
	border-radius: 24px;
`;

const Input = styled(TextInput).attrs(({ theme }) => ({
	cursorColor: theme.secondaryBackground,
	selectionColor: theme.secondaryBackground
}))`
	flex: 1;
	background-color: ${({ theme }) => theme.background};
	border-radius: 20px;
	padding: ${w16}px ${w48}px;
	font-size: 16px;
`;

const Button = styled.TouchableOpacity`
	width: ${w96}px;
	height: ${w96}px;
	margin-left: ${w16}px;
	padding: ${w16}px;
`;

export default ChatBot;