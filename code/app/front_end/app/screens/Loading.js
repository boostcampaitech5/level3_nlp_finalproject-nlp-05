import React from 'react';
import styled from 'styled-components/native';

const getLogoPath = () => {
	const now = new Date();
	const hour = now.getHours();

	if (hour <= 6)
		return require('../assets/logo-night.png');
	else if (hour <= 12)
		return require('../assets/logo-morning.png');
	else if (hour <= 18)
		return require('../assets/logo-afternoon.png');
	else
		return require('../assets/logo-evening.png');
};


const Loading = () => {
	return (
		<Container>
			<Logo source={getLogoPath()} />
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: ${({ theme }) => theme.secondary};
`;

const Logo = styled.Image`
	width: 80%;
	height: 20%;
`;

export default Loading;