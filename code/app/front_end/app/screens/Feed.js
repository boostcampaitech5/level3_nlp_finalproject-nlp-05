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

const getLastDates = yesterday => {
	const date = new Date(yesterday);
	date.setMonth(date.getMonth() - 1);
	date.setDate(date.getDate() + 1);

	const lastDates = [];
	for (; date <= yesterday; date.setDate(date.getDate() + 1)) {
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

const CalendarModal = ({ visible, onSelectCalendar, onClose, yesterday, selectedDate }) => {
	const theme = useTheme();

	return (
		<CalendarModalContainer visible={visible} transparent animationType="fade">
			<CalendarModalBackground activeOpacity={1} onPress={onClose}>
				<CalendarContainer>
					<CalendarPicker
						onDateChange={onSelectCalendar}
						weekdays={['월', '화', '수', '목', '금', '토', '일']}
						months={['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']}
						maxDate={yesterday}
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
						todayBackgroundColor={theme.background}
						todayTextStyle={{ color: theme.gray }}
						disabledDatesTextStyle={{ color: theme.gray }}
					/>
				</CalendarContainer>
			</CalendarModalBackground>
		</CalendarModalContainer>
	);
};

const dummyfeed = [
	[
		{
			time: '06:31',
			text: '이것은 테스트 일기 내용입니다. 일기 생성은 아직 APP과 연동되지 않았습니다. 최종 제출 전까지 완성할 계획입니다.\n이것은 테스트 일기 내용입니다. 일기 생성은 아직 APP과 연동되지 않았습니다. 최종 제출 전까지 완성할 계획입니다.\n이것은 테스트 일기 내용입니다. 일기 생성은 아직 APP과 연동되지 않았습니다. 최종 제출 전까지 완성할 계획입니다.\n'
		},
		{
			time: '06:32',
			text: '이것은 테스트 일기 내용입니다. 일기 생성은 아직 APP과 연동되지 않았습니다. 최종 제출 전까지 완성할 계획입니다.\n이것은 테스트 일기 내용입니다. 일기 생성은 아직 APP과 연동되지 않았습니다. 최종 제출 전까지 완성할 계획입니다.\n이것은 테스트 일기 내용입니다. 일기 생성은 아직 APP과 연동되지 않았습니다. 최종 제출 전까지 완성할 계획입니다.\n'
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
	const [yesterday, setYesterday] = useState(() => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return yesterday;
	});
	const [selectedDate, setSelectedDate] = useState(yesterday);
	const [dates, setDates] = useState(getLastDates(yesterday));
	const [feeds, setFeeds] = useState([]);
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [datesScrollOffset, setDatesScrollOffset] = useState(0);

	const datesScrollRef = useRef(null);
	const theme = useTheme();

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
		
		if (date.getMonth() === yesterday.getMonth()) {
			setDates(getLastDates(yesterday));
		}
		else if (date < startDate || date > endDate) {
			setDates(getMonthDates(date));
		}
		
		loadFeeds(date);
		setCalendarVisible(false);
		setSelectedDate(date);
	};

	const onGotoYesterday = () => {
		setDates(getLastDates(yesterday));
		setSelectedDate(yesterday);
		loadFeeds(yesterday);
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
			<YesterdayButton onPress={onGotoYesterday}>
				<Icon source={require('../assets/today-icon.png')} />
			</YesterdayButton>
		</SelectedDateContainer>

		<CalendarModal
			visible={calendarVisible}
			onSelectCalendar={onSelectCalendar}
			onClose={() => setCalendarVisible(false)}
			yesterday={yesterday}
			selectedDate={selectedDate}
		/>

		<FeedsScroll>
			{feeds && feeds.map((feed, idx) => (
				<FeedContainer key={idx}>
					<FeedTime>{feed.time}</FeedTime>
					<FeedText
						selectable
						selectionColor={theme.secondaryBackground}>
							{feed.text}
					</FeedText>
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

const YesterdayButton = styled.TouchableOpacity`
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
	font-size: ${w64}px;
	font-family: HandWriting;
`;

export default Feed;