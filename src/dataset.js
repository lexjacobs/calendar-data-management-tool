// IMPORTANT: year-month-day OR month-day OR month!!!
import { annual, banner, bars, full, once } from './constants';

const dataset = [
  
  {
    text: "SEPTEMBER / Birthstone: Sapphire / Flower: Aster",
    timing: ['9'],
    repeat: banner
  },
  {
    text: "*NATIONAL HISPANIC HERITAGE MONTH (September 15 - October 15)",
    timing: ['9'],
    repeat: banner
  },
  {
    text:
      "ASSISTANT PRINCIPALS, SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORT, SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORT",
    timing: ['2016-9-1','2016-9-2'],
    repeat: once,
    shading: bars
  },
  {
    text: "Ecclesiastical Year Begins - Greek Orthodox",
    timing: ['9-1'],
    repeat: annual
  },
  {
    text: "NEW MOON",
    timing: ['2016-9-1'],
    repeat: once
  },
  {
    text: "LABOR DAY Legal Holiday - Federal/State",
    timing: ['2016-9-5'],
    repeat: once,
    shading: full,
    mlh: true,
    asp: true
  },
  {
    text: "Custodial Pay Day",
    timing: ['2016-9-8', '2016-9-22'],
    repeat: once,
  }
];

export default dataset;
