import React, { useEffect, useContext } from 'react';
import styled from 'styled-components/native';
import { Context } from '../utils/Context';
import { w108 } from '../utils/theme';

const getLogoPath = () => {
    const now = new Date();
    hour = now.getHours();

    if (hour <= 6)
        return require('../assets/logo-night.png');
    else if (hour <= 12)
        return require('../assets/logo-morning.png');
    else if (hour <= 18)
        return require('../assets/logo-afternoon.png');
    else
        return require('../assets/logo-evening.png');
}


const Login = () => {
    const { isLogin, setIsLogin, loginComplete, setLoginComplete } = useContext(Context);

    useEffect(() => {
        if (loginComplete) {
            setTimeout(() => {
                setIsLogin(true);
            }, 1000);
        }
    }, [loginComplete])

    const handleLogin = () => {
        setLoginComplete(true);
    };

    return (
        <Container>
            <Logo source={getLogoPath()} />
            {!loginComplete && (
                <LoginButton onPress={handleLogin}>
                    <LoginButtonText>로그인</LoginButtonText>
                </LoginButton>
            )}
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.secondary};
`

const Logo = styled.Image`
    width: 80%;
    height: 20%;
`

const LoginButton = styled.TouchableOpacity`
    background-color: white;
    margin-top: ${w108}px;
`

const LoginButtonText = styled.Text`

`

export default Login;