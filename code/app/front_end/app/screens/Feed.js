import React, { useState, useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import { w8, w14, w16, w28, w32, w48, w64, w84, w96, w108, w144 } from '../utils/theme';
import Container from '../components/Container';
import Header from '../components/Header';

const getLastDates = today => {
	const date = new Date(today);
	date.setMonth(date.getMonth() - 1);
	date.setDate(date.getDate() + 1);

	const dates = [];
	for (; date <= today; date.setDate(date.getDate() + 1)) {
		dates.push(new Date(date));
	}

	return dates;
};

const getMonthDates = selectedDate => {
	const date = new Date(selectedDate);
	date.setDate(1);

	const dates = [];
	for (; date.getMonth() < selectedDate.getMonth(); date.setDate(date.getDate() + 1)) {
		dates.push(new Date(date));
	}

	return dates;
};

const dayToKorean = date => {
	const korean = ['일', '월', '화', '수', '목', '금', '토'];

	return korean[date.getDay()];
};

const dummyfeed = [
	[
		{
			time: '12:34',
			text: '오늘은 18일이다. 오늘은 18일이다. \n오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다. 오늘은 18일이다.'
		},
		{
			time: '11:32',
			text: '배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. '
		}
		],
		[
		{
			time: '12:34',
			text: '오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다. 오늘은 17일이다.'
		},
		{
			time: '11:32',
			text: '배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. 배고프다. '
		}
	]
];

const Feed = () => {
	const [today, setToday] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(today);

	const [dates, setDates] = useState(getLastDates(today));
	const [monthFeeds, setMonthFeeds] = useState([]);
	const [feeds, setFeeds] = useState([]);

	const datesScrollRef = useRef(null);

	useEffect(() => {
		datesScrollToRight();

		// dates에 해당하는 monthFeeds 받아오기
		setMonthFeeds(dummyfeed);
		// selectedDate에 해당하는 feeds 받아오기
		setFeeds(dummyfeed[0]);
	}, []);

	const datesScrollToRight = () => {
		if (datesScrollRef.current) {
			datesScrollRef.current.scrollToEnd();
		}
	};

	const getMonthFeed = () => {
		// state update 순서 주의. calendar를 통해 진입 시 인자 올바르게 넣을 것
		setMonthFeeds(dummyfeed)
	}

	const handleSelectDate = date => {
		setSelectedDate(date)

		// selectDate에 해당하는 feeds 받아오기
		setFeeds(monthFeeds[1]);
	}

	const handleCalendar = date => {

	}

	return (
	<Container>
		<Header view='feed' />

		<DatesScrollContainer>
			<DatesScroll horizontal showsHorizontalScrollIndicator={false} ref={datesScrollRef}>
				{dates.map((date, idx) => (
					<DateContainer
						key={idx}
						date={date}
						selectedDate={selectedDate}
						onPress={() => handleSelectDate(date, idx)}
					>
						<DayText date={date} selectedDate={selectedDate}>
							{dayToKorean(date)}
						</DayText>
						<DateText date={date} selectedDate={selectedDate}>
							{date.getDate()}
						</DateText>
					</DateContainer>
				))}
			</DatesScroll>
		</DatesScrollContainer>

		<SelectedDateContainer>
			<SelectedDate onPress={handleCalendar}>
				<SelectedDateText>
					{selectedDate.getFullYear()}. {selectedDate.getMonth() + 1}. {selectedDate.getDate()}.
				</SelectedDateText>
			</SelectedDate>
		</SelectedDateContainer>

		<FeedsScroll>
			{feeds && feeds.map((feed, idx) => (
				<FeedContainer key={idx}>
					<FeedTime>{feed.time}</FeedTime>
					<FeedText>{feed.text}</FeedText>
				</FeedContainer>
			))}
		</FeedsScroll>
	</Container>
	);
};

const DatesScrollContainer = styled.View`
	height: ${w96 * 2}px;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => theme.gray};
`;

const DatesScroll = styled(ScrollView).attrs({
	contentContainerStyle: {
		paddingRight: w64,
		paddingLeft: w64
	}
})`
	flex: 1;
	flex-direction: row;
	padding-top: ${w16}px;
`;

const DateContainer = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	width: ${w108}px;
	height: ${w144}px;
	margin: ${w16}px ${w14}px;
	padding-top: ${w8}px;
	border-radius: ${w48}px;

	background-color: ${({ date, selectedDate, theme }) => 
		date.getDate() === selectedDate.getDate() ? theme.secondary : theme.background
	};
`;

const DayText = styled.Text`
	font-size: 11px;
	color: ${({ date, selectedDate, theme }) => 
		date.getDate() === selectedDate.getDate() ? theme.background : 'black'
	};
`;

const DateText = styled.Text`
	font-size: 21px;
	font-weight: 600;
	color: ${({ date, selectedDate, theme }) => 
		date.getDate() === selectedDate.getDate() ? theme.background : 'black'
	};
`;

const SelectedDateContainer = styled.View`
	padding: ${w16}px ${w28}px ${w28}px;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => theme.gray};
`;

const SelectedDate = styled.TouchableOpacity``;

const SelectedDateText = styled.Text`
	font-size: ${w108}px;
	font-weight: 600;
`;

const FeedsScroll = styled.ScrollView`
	flex: 1;
`;

const FeedContainer = styled.View`
	flex: 1;
	padding: ${w32}px 0;
`;

const FeedTime = styled.Text`
	padding-left: ${w64}px;
	padding-bottom: ${w28}px;
	font-size: ${w96}px;
	font-family: HandWriting;
`;

const FeedText = styled.Text`
	padding: 0 ${w84}px;
	font-size: 18px;
	font-family: HandWriting;
`;

export default Feed;