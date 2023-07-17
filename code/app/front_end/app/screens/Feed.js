import React, { useState, useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { w8, w14, w16, w24, w28, w32, w48, w64, w78, w96, w108, w144, androidHeader, iosHeader } from '../utils/theme'
import Container from '../components/Container'
import Header from '../components/Header'

const getLastDates = (today) => {
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  oneMonthAgo.setDate(oneMonthAgo.getDate() + 1);

  const dates = [];
  const days = [];
  for (; oneMonthAgo <= today; oneMonthAgo.setDate(oneMonthAgo.getDate() + 1)) {
    dates.push(oneMonthAgo.getDate());
    days.push(oneMonthAgo.getDay());
  }
  
  const daysToKorean = ['일', '월', '화', '수', '목', '금', '토'];
  const kdays = days.map(d => daysToKorean[d]);
  return [dates, kdays];
}

// const dummyfeed

const Feed = () => {
  const [today, setToday] = useState(new Date())
  
  const [lastDates, lastDays] = getLastDates(today);
  const [dates, setDates] = useState(lastDates);
  const [days, setDays] = useState(lastDays);
  const [feeds, setFeeds] = useState([]);
  
  const datesScrollRef = useRef(null);

  useEffect(() => {
    datesScrollToRight();
  });

  const datesScrollToRight = () => {
    if (datesScrollRef.current) {
      datesScrollRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <Container>
      <Header view='feed' />

      <DatesScrollContainer>
        <DatesScroll horizontal showsHorizontalScrollIndicator={false} ref={datesScrollRef}>
          {dates.map((date, idx) => (
            <DateContainer key={date}>
              <DayText>
                {days[idx]}
              </DayText>
              <DateText>
                {date}
              </DateText>
            </DateContainer>
          ))}
        </DatesScroll>
      </DatesScrollContainer>
      <SelectedDate>
        {today.getFullYear()}. {today.getMonth() + 1}. {today.getDate()}.
      </SelectedDate>
    </Container>
  );
};

const DatesScrollContainer = styled.View`
  height: ${w96 * 2}px;
  border-bottom-width: 1px;
  border-bottom-color: black;
`

const DatesScroll = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingRight: w64,
    paddingLeft: w64
  }
})`
  flex: 1;
  flex-direction: row;
  padding-top: ${w16}px;
`

const DateContainer = styled.View`
  flex: 1;
  align-items: center;
  width: ${w108}px;
  height: ${w144}px;
  margin: ${w16}px ${w14}px;
  padding-top: ${w8}px;
  border-radius: ${w48}px;
  
  background-color: ${({ theme }) => theme.secondary};
`

const DayText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.background};
`
const DateText = styled.Text`
  font-size: 21px;
  font-weight: 600;
  color: ${({ theme }) => theme.background};
`

const SelectedDate = styled.Text`
  font-size: ${w108}px;
  font-weight: 600;
  padding: ${w32}px ${w28}px ${w64}px;
`

export default Feed