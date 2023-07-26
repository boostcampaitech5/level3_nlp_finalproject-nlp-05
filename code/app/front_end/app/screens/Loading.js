import { useEffect, useContext } from 'react';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import * as Application from 'expo-application';
import { toast } from '../utils/toast';
import * as SplashScreen from 'expo-splash-screen';
import { Context } from '../utils/Context';

const Loading = () => {
	const { setIsLogin, setUserId, setFirstVisit } = useContext(Context);

	useEffect(() => {
		const loading = async () => {
			try {
				// load font
				await Font.loadAsync({
					'Light': require('../assets/fonts/NanumSquareNeo-aLt.ttf'),
					'Regular': require('../assets/fonts/NanumSquareNeo-bRg.ttf'),
					'Bold': require('../assets/fonts/NanumSquareNeo-cBd.ttf'),
					'HandWriting': require('../assets/fonts/nanum_handwriting.ttf')
				});

				// login or signup
				const savedUserId = await SecureStore.getItemAsync('id');
				
				if (savedUserId) {
					setUserId(savedUserId);
					
					// setUserId('test_id') // TODO 임시로 넣은 ID, 추후 삭제
					
				} else {
					const newUserId = Application.androidId;
					// const newUserId = 'test_id'; // TODO 임시로 넣은 ID
					setFirstVisit(true);
					await SecureStore.setItemAsync('id', newUserId);
					
					const res = await axios.post('http://34.64.120.166:8000/api/profile/', {
						user_id: newUserId
					}, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					})

					setUserId(newUserId);
				}

				setIsLogin(true);

				// hide splash screen
				await SplashScreen.hideAsync();

			} catch (error) {
				toast('로그인에 실패했습니다.');
				console.log(error);
			}
		};
		
		loading();
	}, []);

	return null;
};

export default Loading;