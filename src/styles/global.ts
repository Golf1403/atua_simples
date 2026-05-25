import { createGlobalStyle, styled } from 'styled-components';
import ArialMt from '@styles/fonts/arial-mt.ttf';
import FranklinGothic from '@styles/fonts/FranklinGothic.ttf';
import Baloo from '@styles/fonts/baloo.ttf';
import Barlow from '@styles/fonts/barlow.ttf';
import Baskvl from '@styles/fonts/baskvl.ttf';
import Calibri from '@styles/fonts/calibri.ttf';
import Cour from '@styles/fonts/cour.ttf';
import Freehand521Bt from '@styles/fonts/freehand-521-bt.ttf';
import Futura from '@styles/fonts/futura.ttf';
import Georgia from '@styles/fonts/georgia.ttf';
import ScriptMtBoldFont from '@styles/fonts/script-mt-bold-font.ttf';
import TimesNewRoman from '@styles/fonts/times-new-roman.ttf';
import Verdana from '@styles/fonts/verdana.ttf';
import Lucida from '@styles/fonts/lucida-sans.ttf';
import Bahnschrift from '@styles/fonts/bahnschrift.ttf';

export function stripUnits($number: number) {
  return $number / ($number * 0 + 1);
}

export function rem($number: number) {
  const number = stripUnits($number) / 16;
  return `${number}rem`;
}

export const colorwhite = '#ffffff';

export const colorstategray = '#69788c';
export const colorlightstategray = '#7a869a';
export const colorbabyponder = '#f8fafb';

export const colormiddleyellow = '#FEFFE7';

//Layout colors
export const colorblack = '#000000';
export const pictonblue = '#02A7FF';
export const colororangered = '#f36062';
export const colorred = '#FF0000';
export const coloraero = '#5392c1';
export const coloryellowgreen = '#7fc028';
export const colormaximumpurple = '#793491';
export const colorrufous = '#a02a10';
export const colormountainmeadow = '#18b692';
export const colorerror = colororangered;
export const colorsuccess = coloryellowgreen;
export const colorwarning = colormiddleyellow;
export const colordisabled = '#d8d8d880';
export const colorgray80 = '#eaeaea';
export const colorblueE8 = '#e8f0fe';
export const colorlightblue = '#00aff0';

export const colorblue = '#5392c1';

export const colormoodyblue = '#8884d8';
export const colorsummergreen = '#82ca9d';
export const colorrajah = '#fdad5c';
export const colorastral = '#346991';
export const colorsalmon = '#ff726f';

export const colorsfinancing = [colormoodyblue, colorsummergreen, colorrajah, colorastral, colorsalmon, colorblack];

export const colorinstallments = '#afabab';
export const colorpayments = '#ff7575';
export const colorexpenses = '#ffd966';
export const colorfees = '#a9d18e';
export const colorbabyblue = '#f1f1f1';
export const colorfine = '#b07bd7';
export const colorinterest = '#75d1f1';

// Font Family
export const fontprimary = 'Lato';
export const fontfamily = `${fontprimary}, 'Helvetica', 'Arial', 'sans-serif'`;

// Font Weights
export const light = 300;
export const regular = 400;
export const bold = 700;

export const fontsdbarxxs = rem(14);
export const fontsdbarxs = rem(16);
export const fontsdbarsm = rem(18);
export const fontsdbarmd = rem(20);
export const fontsdbarlg = rem(28);
export const fontsdbarxl = rem(40);
export const fontsdbarxxl = rem(44);

export const fontxxs = rem(6);
export const fontxs = rem(8);
export const fontsm = rem(10);
export const fontmd = rem(12);
export const fontlg = rem(14);
export const fontxl = rem(16);
export const fontxxl = rem(18);

export const linexs = rem(16);
export const linesm = rem(18);
export const linemd = rem(22);
export const linelg = rem(28);
export const linexl = rem(40);
export const linexxl = rem(46);

export const marginsm = rem(15);
export const marginmd = rem(30);
export const marginlg = rem(45);
export const marginxl = rem(60);

export const ButtonDefault = styled.button`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  justify-content: center;
  background-color: transparent;
  width: 100%;
  height: 100%;
  color: ${coloraero};
  font-size: ${fontmd};
  border: 1px solid ${coloraero};
  border-radius: rem(4);
  margin-bottom: 0;
  cursor: pointer;
  &:disabled {
    opacity: 0.7;
    pointer-events: none;
  }
  &.disabled {
    color: ${colordisabled};
    border: 1px solid ${colordisabled};
    opacity: 0.7;
    pointer-events: none;
  }
  & > div {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;

export const ButtonActionDefault = styled(ButtonDefault)`
  position: relative;
  border: none;
  color: ${colorstategray};
  width: ${rem(20)};
  height: ${rem(20)};

  svg {
    font-size: ${fontmd};
  }
`;

// Breakpoints
export const phonexs = '476px';
export const phonesm = '576px';
export const tabletmd = '768px';
export const desktoplg = '992px';
export const desktopxl = '1200px';
export const desktopxxl = '1600px';
export const desktop4k = '1921px';

export const TitleContainer = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  max-width: 500px;
  min-width: 300px;
  width: 100%;
  height: ${rem(40)};

  @media (max-width: ${desktopxxl}) {
    max-width: ${rem(500)};
    min-width: ${rem(300)};
  }
`;

export default createGlobalStyle`

*,
  *::before,
  *::after {
    box-sizing: border-box;
    outline: 0;
    margin: 0px;
    padding: 0px;
    border: none;
  }

  .icon {
    pointer-events: none;
    font-size: ${rem(24)};
  }


  @font-face {
    font-family: 'Arial Rounded MT';
    src: url(${ArialMt}) format('truetype');
  }
  @font-face {
    font-family: 'Bahnschrift';
    src: url(${Bahnschrift}) format('truetype');
  }
  @font-face {
    font-family: 'Lucida';
    src: url(${Lucida}) format('truetype');
  }
  @font-face {
    font-family: 'Calibri';
    src: url(${Calibri}) format('truetype');
  }
  @font-face {
    font-family: 'Baloo';
    src: url(${Baloo}) format('truetype');
  }
  @font-face {
    font-family: 'Baskerville Old Face';
    src: url(${Baskvl}) format('truetype');
  }
  @font-face {
    font-family: 'Barlow';
    src: url(${Barlow}) format('truetype');
  }
  @font-face {
    font-family: 'Courier New';
    src: url(${Cour}) format('truetype');
  }
  @font-face {
    font-family: 'Franklin';
    src: url(${FranklinGothic}) format('truetype');
  }
  @font-face {
    font-family: 'Freehans521 BT';
    src: url(${Freehand521Bt}) format('truetype');
  }
  @font-face {
    font-family: 'Futura';
    src: url(${Futura}) format('truetype');
  }
  @font-face {
    font-family: 'Georgia';
    src: url(${Georgia}) format('truetype');
  }
  @font-face {
    font-family: 'Script MT Bold';
    src: url(${ScriptMtBoldFont}) format('truetype');
  }
  @font-face {
    font-family: 'Times New Roman';
    src: url(${TimesNewRoman}) format('truetype');
  }
  @font-face {
    font-family: 'Verdana';
    src: url(${Verdana}) format('truetype');
  }

  html,
  body {
    background: ${colorbabyponder};
    font-family: ${fontfamily};
    font-size: ${fontxxs};
    font-weight: ${regular};
    color: ${colorlightstategray};
    @media (min-width: ${phonexs}) {
      font-size: ${fontxs};
    }
    @media (min-width: ${phonesm}) {
      font-size: ${fontsm};
    }
    @media (min-width: ${tabletmd}) {
      font-size: ${fontmd};
    }
    @media (min-width: ${desktoplg}) {
      font-size: ${fontlg};
    }
    @media (min-width: ${desktopxl}) {
      font-size: ${fontxl};
    }
    @media (min-width: ${desktopxxl}) {
      font-size: ${fontxxl};
    }
    @media (min-width: ${desktop4k}) {
      font-size: ${fontxxl};
    }


  }

  p {
    font-size: ${fontsm};
    line-height: ${linesm};
  }

  a {
    color: ${coloraero};
    font-size: ${fontsm};
    font-weight: ${regular};
    text-decoration: underline;
    cursor: pointer;
  }


  .mt-20 {
    margin-top: rem(20);
  }

  .mr-20 {
    margin-right: rem(20);
  }

  .mb-20 {
    margin-bottom: rem(20);
  }

  .ml-20 {
    margin-left: rem(20);
  }

  .mb-30 {
    margin-bottom: rem(30);
  }

  .mr-10 {
    margin-right: rem(10);
  }

  .ml-10 {
    margin-left: rem(10);
  }

  .flex-grow-1 {
    flex-grow: 1;
  }
  .hidden {
    visibility: hidden;
  }
  .visible {
    visibility: visible;
  }

  .react-datepicker-popper,
  .sei-datepicker-popper {
    z-index: 100000 !important;
  }

  .react-datepicker {
    z-index: 100000 !important;
  }
`;
