// IMPORTANT: year-month-day OR month-day OR month!!!
import { annual, banner, bars, full, variable } from './constants';
import { Firebase } from './firebase';

const bannerEvents = [
  {
    text: "inset box: 'ASSISTANT PRINCIPALS, & SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORTED AUGUST xxth ??'",
    timing: ['9'],
    repeat: banner
  },
  {
    text: "SEPTEMBER / Birthstone: Sapphire / Flower: Aster",
    timing: ['9'],
    repeat: banner
  },
  {
    text: "*NATIONAL HISPANIC HERITAGE MONTH (September 15 - October 15)",
    timing: ['9'],
    repeat: banner
  }
];

const annualEvents = [
  {
    text: "Ecclesiastical Year Begins - Greek Orthodox",
    timing: ['9-1'],
    repeat: annual
  }
];

const variableEvents = [
  {
    text:
      "ASSISTANT PRINCIPALS, SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORT, SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORT",
    timing: ['2016-9-1','2016-9-2'],
    repeat: variable,
    shading: bars
  },
  {
    text: "NEW MOON",
    timing: ['2016-9-1'],
    repeat: variable
  },
  {
    text: "LABOR DAY Legal Holiday - Federal/State",
    timing: ['2016-9-5'],
    repeat: variable,
    shading: full,
    mlh: "yes",
    asp: "yes"
  },
  {
    text: "Custodial Pay Day",
    timing: ['2016-9-8', '2016-9-22'],
    repeat: variable,
  }
];

const dataset = [].concat(bannerEvents).concat(annualEvents).concat(variableEvents);

var events = Firebase.database().ref('events');
events.set(dataset);

export default dataset;
