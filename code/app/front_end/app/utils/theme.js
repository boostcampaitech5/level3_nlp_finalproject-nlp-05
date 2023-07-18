import { Dimensions } from 'react-native';

export const getTheme = () => {
  const morningTheme = {
    primary: '#F6CB42',
    secondary: '#FF8562',
    primaryBackground: '#F6D365',
    secondaryBackground: '#FDA085',
    background: '#FFFDF9'
  }
  
  const afternoonTheme = {
    primary: '#ACE56D',
    secondary: '#3FA3F4',
    primaryBackground: '#C2E59C',
    secondaryBackground: '#64B3F4',
    background: '#F9FFF3'
  }
  
  const eveningTheme = {
    primary: '#4568DC',
    secondary: '#B06AB3',
    primaryBackground: '#6886EB',
    secondaryBackground: '#C88ACB',
    background: '#F6F8FF'
  }
  
  const nightTheme = {
    primary: '#2B5876',
    secondary: '#4E4376',
    primaryBackground: '#497898',
    secondaryBackground: '#695E92',
    background: '#F6FCFF'
  }

  const now = new Date();
  hour = now.getHours();
  if (hour <= 6) {
    theme = nightTheme;
  }
  else if (hour <= 12) {
    theme = morningTheme;
  }
  else if (hour <= 18) {
    theme = afternoonTheme;
  }
  else {
    theme = eveningTheme;
  }
  return {
    ...theme,
    gray: '#DADCE0'
  };
}

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const w8 = SCREEN_WIDTH * 0.007;
export const w14 = SCREEN_WIDTH * 0.013;
export const w16 = SCREEN_WIDTH * 0.015;
export const w24 = SCREEN_WIDTH * 0.022;
export const w28 = SCREEN_WIDTH * 0.026;
export const w32 = SCREEN_WIDTH * 0.030;
export const w48 = SCREEN_WIDTH * 0.044;
export const w64 = SCREEN_WIDTH * 0.059;
export const w84 = SCREEN_WIDTH * 0.078;
export const w92 = SCREEN_WIDTH * 0.085;
export const w96 = SCREEN_WIDTH * 0.089;
export const w108 = SCREEN_WIDTH * 0.100;
export const w144 = SCREEN_WIDTH * 0.133;
export const w160 = SCREEN_WIDTH * 0.148;
export const androidHeader = SCREEN_WIDTH * 0.233;
export const iosHeader = SCREEN_WIDTH * 0.148;