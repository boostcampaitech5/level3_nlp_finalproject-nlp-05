import React, { useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { Context } from '../utils/Context';
import * as SecureStore from 'expo-secure-store';
import { toast } from '../utils/toast';
import * as SplashScreen from 'expo-splash-screen';

const Login = () => {
	const { setIsLogin, setUserId, setFirstVisit } = useContext(Context);

	useEffect(() => {
		const handleLogin = async () => {
			try {
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

			} catch (error) {
				toast('로그인에 실패했습니다.');

			} finally {
				setTimeout(async () => {
					setIsLogin(true);
					await SplashScreen.hideAsync();
				}, 1000);
			}
		};
		
		handleLogin();
	}, []);

	return null;
};

export default Login;