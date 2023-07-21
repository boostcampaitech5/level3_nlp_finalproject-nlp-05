import React, { createContext, useState } from 'react';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
	const [isLogin, setIsLogin] = useState(false);
	const [userId, setUserId] = useState('');
	const [firstVisit, setFirstVisit] = useState(false);

	return (
		<Context.Provider value={{ isLogin, setIsLogin, userId, setUserId, firstVisit, setFirstVisit }}>
			{children}
		</Context.Provider>
	);
};