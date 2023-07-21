import React, { useEffect, useContext } from 'react';
import * as Font from 'expo-font';
import { Context } from '../utils/Context';
import * as SecureStore from 'expo-secure-store';
import { toast } from '../utils/toast';
import * as SplashScreen from 'expo-splash-screen';

const Loading = () => {
	const { setIsLogin, setUserId, setFirstVisit } = useContext(Context);

	useEffect(() => {
		const loading = async () => {
			try {
				// load font
				await Font.loadAsync({
					'HandWriting': require('../assets/fonts/nanum_handwriting.ttf')
				});

				// login or signup
				const savedUserId = await SecureStore.getItemAsync('userId');
				if (savedUserId) {
					setUserId(savedUserId);
					
				} else {
					// API로 불러오기
					const newUserId = '12345';
					setFirstVisit(true);
					await SecureStore.setItemAsync('userId', newUserId);
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