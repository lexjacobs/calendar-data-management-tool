// IMPORTANT: year-month-day OR month-day OR month!!!
import { annual, banner, bars, full, variable } from './constants';
import { Firebase } from './firebase';

const bannerEvents = [
  {
    text: "inset box: 'ASSISTANT PRINCIPALS, & SCHOOL-BASED INTERMEDIATE SUPERVISORS REPORTED AUGUST xxth'",
    timing: ['9'],
    repeat: banner
  },
  {
    text: "SEPTEMBER / Birthstone: Sapphire Flower: Aster",
    timing: ['9'],
    repeat: banner
  },
  {
    text: "NATIONAL HISPANIC HERITAGE MONTH (September 15 - October 15)",
    timing: ['9'],
    repeat: banner,
    proclamation: 'yes'
  }
];

const annualEvents = [
  {
    text: "Ecclesiastical Year Begins - Greek Orthodox",
    timing: ['9-1'],
    repeat: annual
  },
  {
    text: "Beheading of St John the Baptist Russian Orthodox",
    timing: ['9-11'],
    repeat: annual
  },
  {
    text: "Feast of the Elevation of the Cross Greek Orthodox",
    timing: ['9-14'],
    repeat: annual
  },
  {
    text: "Independence Day Guatemalan, Honduran & Nicaraguan",
    timing: ['9-15'],
    repeat: annual
  },
  {
    text: "Independence Day - Mexican",
    timing: ['9-16'],
    repeat: annual
  },
  {
    text: "Citizenship Day",
    timing: ['9-17'],
    repeat: annual,
    proclamation: 'yes'
  },
  {
    text: "Independence Day - Chilean",
    timing: ['9-18'],
    repeat: annual
  },
  {
    text: "Nativity of the Virgin Mary Russian Orthodox",
    timing: ['9-21'],
    repeat: annual
  },
  {
    text: "Republic Day - Trinidadian",
    timing: ['9-24'],
    repeat: annual
  },
  {
    text: "Feast of the Elevation of the Cross Russian Orthodox",
    timing: ['9-27'],
    repeat: annual
  },
  {
    text: "Confucius' Birthday - Chinese",
    timing: ['9-28'],
    repeat: annual
  },
];

const variableEvents = [
  {
    text: "NEW MOON",
    timing: ['2016-9-1', '2016-9-30'],
    repeat: variable
  },
  {
    text: "MOON - FIRST QUARTER",
    timing: ['2016-9-9'],
    repeat: variable
  },
  {
    text: "FULL MOON",
    timing: ['2016-9-16'],
    repeat: variable
  },
  {
    text: "MOON - LAST QUARTER",
    timing: ['2016-9-23'],
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
    text: "Pay Day",
    timing: ['2016-9-15', '2016-9-30'],
    repeat: variable,
  },
  {
    text: "Custodial Pay Day",
    timing: ['2016-9-8', '2016-9-22'],
    repeat: variable,
  },
  {
    text: "ACT EXAM DAY",
    timing: ['2016-9-10'],
    repeat: variable
  },
  {
    text:
      "'ASSISTANT PRINCIPALS, SCHOOL BASED INTERMEDIATE SUPERVISORS REPORT'",
    timing: ['2016-9-1','2016-9-2'],
    repeat: variable,
    shading: bars
  },
  {
    text:
      "FIRST DAY FOR ENTIRE FACULTY CLASSROOM PREPARATION",
    timing: ['2016-9-6'],
    repeat: variable,
    shading: bars
  },
  {
    text:
      "CHANCELLOR'S CONFERENCE DAY FOR STAFF DEVELOPMENT",
    timing: ['2016-9-7'],
    repeat: variable,
    shading: bars
  },
  {
    text: "FIRST DAY OF SCHOOL EARLY DISMISSAL FOR NON-DISTRICT 75 KINDERGARTEN STUDENTS ONLY",
    timing: ['2016-9-8'],
    repeat: variable
  },
  {
    text: "SCHOOLS CLOSED",
    timing: ['2016-9-12'],
    repeat: variable,
    shading: full,
  },
  {
    text: "Alternate Side Parking OFF (extra)",
    timing: ['2016-9-13', '2016-9-14'],
    repeat: variable,
  },
  {
    text: "Federal Lands Cleanup Day",
    timing: ['2016-9-10'],
    repeat: variable,
    proclamation: 'yes'
  },
  {
    text: "CONSTITUTION WEEK SEPT 17-23",
    timing: ['2016-9-11'],
    repeat: variable,
    proclamation: 'yes'
  },
  {
    text: "National Grandparents' Day",
    timing: ['2016-9-11'],
    repeat: variable,
    proclamation: 'yes'
  },
  {
    text: "Feast of Sacrifice - Eid al-Adha - Islamic",
    timing: ['2016-9-12'],
    repeat: variable,
    previousSundown: 'yes',
    shading: full,
    skipCount: 'yes'
  },
  {
    text: "Mid-Autumn Festival Asian",
    timing: ['2016-9-15'],
    repeat: variable
  },
  {
    text: "FIRST DAY OF AUTUMN",
    timing: ['2016-9-22'],
    repeat: variable
  },
  {
    text: "General von Steuben Day",
    timing: ['2016-9-17'],
    repeat: variable
  },
  {
    text: "Gold Star Mother's Day",
    timing: ['2016-9-25'],
    repeat: variable,
    proclamation: 'yes'
  },
];

const dataset = [].concat(bannerEvents).concat(annualEvents).concat(variableEvents).map(x => {

  // make it clear if database gets hydrated from dataset
  x.text = `TEST ${x.text}`;
  return x;
});

var events = Firebase.database().ref('events');
events.set(dataset);

export default dataset;
