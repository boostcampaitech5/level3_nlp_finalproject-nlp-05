import React, { useState, useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import CalendarPicker from 'react-native-calendar-picker';
import axios from 'axios';
import { SCREEN_WIDTH, w8, w14, w16, w28, w32, w48, w64, w84, w96, w108, w144 } from '../utils/theme';
import Container from '../components/Container';
import Header from '../components/Header';
import Icon from '../components/Icon';
import { toast } from '../utils/toast';

const getLastDates = today => {
	const date = new Date(today);
	date.setMonth(date.getMonth() - 1);
	date.setDate(date.getDate() + 1);

	const lastDates = [];
	for (; date <= today; date.setDate(date.getDate() + 1)) {
		lastDates.push(new Date(date));
	}

	return lastDates;
};

const getMonthDates = selectedDate => {
	const date = new Date(selectedDate);
	date.setDate(1);

	const monthDates = [];
	for (; date.getMonth() === selectedDate.getMonth(); date.setDate(date.getDate() + 1)) {
		monthDates.push(new Date(date));
	}

	return monthDates;
};

const dayToKorean = date => {
	const korean = ['일', '월', '화', '수', '목', '금', '토'];

	return korean[date.getDay()];
};

const CalendarModal = ({ visible, onSelectCalendar, onClose, today, selectedDate }) => {
	const theme = useTheme();

	return (
		<CalendarModalContainer visible={visible} transparent animationType="fade">
			<CalendarModalBackground activeOpacity={1} onPress={onClose}>
				<CalendarContainer>
					<CalendarPicker
						onDateChange={onSelectCalendar}
						weekdays={['월', '화', '수', '목', '금', '토', '일']}
						months={['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']}
						maxDate={today}
						width={SCREEN_WIDTH * 0.9}
						textStyle={{ fontFamily: 'Light' }}
						previousTitle='◀'
						nextTitle='▶'
						selectMonthTitle='월 선택: '
						selectYearTitle='연 선택'
						initialDate={selectedDate}
						selectedStartDate={selectedDate}
						selectedDayColor={theme.secondary}
						selectedDayTextColor={theme.background}
					/>
				</CalendarContainer>
			</CalendarModalBackground>
		</CalendarModalContainer>
	);
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
	const [feeds, setFeeds] = useState([]);
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [datesScrollOffset, setDatesScrollOffset] = useState(0);

	const datesScrollRef = useRef(null);

	useEffect(() => {
		datesScrollToRight();
		// selectedDate에 해당하는 feeds 받아오기
		setFeeds(dummyfeed[0]);
	}, []);

	useEffect(() => {
		const selectedIndex = dates.findIndex(date => date.getDate() === selectedDate.getDate());
		const selectedX = selectedIndex * (w108 + w28) + w64;

		const startIndex = datesScrollOffset + w64;
		const endIndex = datesScrollOffset + w64 + 6 * (w108 + w28);

		if (selectedX < startIndex) {
			datesScrollRef.current.scrollTo({ x: selectedX - w64, y: 0, animated: true });
		}
		else if (selectedX > endIndex) {
			datesScrollRef.current.scrollTo({ x: selectedX - 6 * (w108 + w28) - w64, y: 0, animated: true });
		}
	}, [selectedDate]);

	const datesScrollToRight = () => {
		if (datesScrollRef.current) {
			datesScrollRef.current.scrollToEnd();
		}
	};

	const loadFeeds = date => {
		// date에 해당하는 feeds 받아오기
		try {
			setFeeds(dummyfeed[1]);
		} catch (error) {
			toast('서버 접속이 원활하지 않습니다.');
			console.log(error);
		}
	}

	const onSelectDate = date => {
		setSelectedDate(date);
		loadFeeds(date);
	};

	const onSelectCalendar = selectedCalendarDate => {
		let date = new Date(selectedCalendarDate);
		
		const startDate = new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate());
		const endDate = new Date(dates[dates.length - 1].getFullYear(), dates[dates.length - 1].getMonth(), dates[dates.length - 1].getDate());
		date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		
		if (date.getMonth() === today.getMonth()) {
			setDates(getLastDates(today));
		}
		else if (date < startDate || date > endDate) {
			setDates(getMonthDates(date));
		}
		
		loadFeeds(date);
		setCalendarVisible(false);
		setSelectedDate(date);
	};

	const onGotoToday = () => {
		setDates(getLastDates(today));
		setSelectedDate(today);
		loadFeeds(today);
	};

	return (
	<Container>
		<Header view='feed' />

		<DatesScrollContainer>
			<DatesScroll
				horizontal
				showsHorizontalScrollIndicator={false}
				ref={datesScrollRef}
				onScroll={e => setDatesScrollOffset(e.nativeEvent.contentOffset.x)}
			>
				{dates.map((date, idx) => (
					<DateContainer
						key={idx}
						date={date}
						selectedDate={selectedDate}
						onPress={() => onSelectDate(date, idx)}
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
			<SelectedDate onPress={() => setCalendarVisible(true)}>
				<SelectedDateText>
					{selectedDate.getFullYear()}. {selectedDate.getMonth() + 1}. {selectedDate.getDate()}. ▾
				</SelectedDateText>
			</SelectedDate>
			<TodayButton onPress={onGotoToday}>
				<Icon source={require('../assets/today-icon.png')} />
			</TodayButton>
		</SelectedDateContainer>

		<CalendarModal
			visible={calendarVisible}
			onSelectCalendar={onSelectCalendar}
			onClose={() => setCalendarVisible(false)}
			today={today}
			selectedDate={selectedDate}
		/>

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
	justify-content: space-between;
	align-items: center;
	width: ${w108}px;
	height: ${w144}px;
	margin: ${w16}px ${w14}px;
	padding: ${w16}px 0;
	border-radius: ${w48}px;

	background-color: ${({ date, selectedDate, theme }) => 
		date.getDate() === selectedDate.getDate() ? theme.secondary : theme.background
	};
`;

const DayText = styled.Text`
	font-size: 11px;
	font-family: Light;
	color: ${({ date, selectedDate, theme }) => 
		date.getDate() === selectedDate.getDate() ? theme.background : 'black'
	};
`;

const DateText = styled.Text`
	font-size: 21px;
	font-family: Regular;
	color: ${({ date, selectedDate, theme }) => 
		date.getDate() === selectedDate.getDate() ? theme.background : 'black'
	};
`;

const SelectedDateContainer = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: ${w16}px ${w64}px ${w28}px ${w28}px;
	border-bottom-width: 1px;
	border-bottom-color: ${({ theme }) => theme.gray};
`;

const SelectedDate = styled.TouchableOpacity`
`;

const SelectedDateText = styled.Text`
	font-size: ${w96}px;
	font-family: Regular;
	line-height: ${w108 + w16}px;
`;

const TodayButton = styled.TouchableOpacity`
	width: ${w96}px;
	height: ${w96}px;
	background-color: ${({ theme }) => theme.secondaryBackground};
	border-radius: ${w32}px;
	margin-top: ${w16}px;
	padding: ${w8}px;
`;

const CalendarModalContainer = styled.Modal``;

const CalendarModalBackground = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.5);
`;

const CalendarContainer = styled.View`
	margin: 16px;
	background-color: ${({ theme }) => theme.background};
	border-radius: 16px;
	padding: 16px;
	height: 42%;
`;

const FeedsScroll = styled.ScrollView`
	flex: 1;
	padding-top: ${w32}px;
`;

const FeedContainer = styled.View`
	flex: 1;
	padding: ${w32}px 0;
`;

const FeedTime = styled.Text`
	padding-left: ${w48}px;
	padding-bottom: ${w8}px;
	font-size: ${w84}px;
	font-family: Light;
`;

const FeedText = styled.Text`
	padding: 0 ${w96}px;
	font-size: 18px;
	font-family: HandWriting;
`;

export default Feed;