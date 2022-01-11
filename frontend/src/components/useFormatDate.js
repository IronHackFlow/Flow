import React from 'react';

export default function useFormatDate() {
  const initialTimeFrame = {
    y: '',
    Y: '',
    yr: '',
    Yr: '',
    yrs_ago: '',
    Yrs_Ago: '',
    years_ago: '',
    Years_Ago: '',
  }
  // const [formattedDate, setFormattedDate] = useState();
  // const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  // const [timeDiff, setTimeDiff] = useState();
  // const [formatString, setFormatString] = useState('')

  // const getDate = new Date()
  // const currentDate = Date.parse(getDate)
  // const objDate = Date.parse(date)
  // const timeDiff = currentDate - objDate

  const year = 31536000000
  const month = 2592000000
  const week = 604800000
  const day = 86400000
  const hour = 3600000
  const minute = 60000
  const second = 1000


  // if (timeDiff >= year) {
  //   formattedDate = `${Math.round(timeDiff / year)}y`
  // } else if (timeDiff >= month && timeDiff < year) {
  //   if (timeDiff / month < 11.5) {
  //     formattedDate = `${Math.round(timeDiff / month)}m`
  //   } else {
  //     formattedDate = '1y'
  //   }
  // } else if (timeDiff >= week && timeDiff < month * 2) {
  //   formattedDate = `${Math.round(timeDiff / week)}w`
  // } else if (timeDiff >= day && timeDiff < week) {
  //   formattedDate = `${Math.round(timeDiff / day)}d`
  // } else if (timeDiff >= hour && timeDiff < day) {
  //   formattedDate = `${Math.round(timeDiff / hour)}h`
  // } else if (timeDiff >= minute && timeDiff < hour) {
  //   formattedDate = `${Math.round(timeDiff / minute)}min`
  // } else if (timeDiff >= second && timeDiff < minute) {
  //   formattedDate = `${Math.round(timeDiff / second)}s`
  // } else if (date == null) {
  //   formattedDate = "1y"
  // }
  

  //inputs { y, Y, yr, Yr, yrs ago, Yrs Ago, years ago, Years Ago, MonthDYear, MMDDYYYY}  
  // MMMM Dth YYYY
  // MMMM D YYYY
  // M
  // MM
  // MM Ago
  // MMMM Ago


  const formatDate = (date, string) => {
    if (date == null) return
    const { timeFrame, timeDigit } = getFormattedTime(date)
    const { format } = loopObject(string, timeFrame)
    let returnDate = `${timeDigit}${format}`
    return returnDate
  }

  const loopObject = (string, timeFrame) => {
    if (timeFrame == null) return
    let format
    for (const [key] of Object.entries(timeFrame)) {
      if (key === string) {
        format = `${timeFrame[key]}`
      }
    }
    return { format }
  }
  const getMonthDYr = (date) => {
    const [year, month, day] = date.slice(0, 10).split('-')
    const monthName = getMonthFromNumm(month, 3)
    return `${monthName} ${day}, ${year}`
  }

  const getMonthFromNumm = (num, partial) => {
    switch (num) {
      case '01':
        if (partial === 3) return "Jan"
        else return "January"
      case '02':
        if (partial === 3) return "Feb"
        else return "February"
      case '03':
        if (partial === 3) return "Mar"
        else return "March"
      case '04':
        if (partial === 3) return "Apr"
        else return "April"
      case '05':
        if (partial === 3) return "May"
        else return "May"
      case '06':
        if (partial === 3) return "Jun"
        else return "June"
      case '07':
        if (partial === 3) return "Jul"
        else return "July"
      case '08':
        if (partial === 3) return "Aug"
        else return "August"
      case '09':
        if (partial === 3) return "Sep"
        else return "September"
      case '10':
        if (partial === 3) return "Oct"
        else return "October"
      case '11':
        if (partial === 3) return "Nov"
        else return "November"
      case '12':
        if (partial === 3) return "Dec"
        else return "December"
      default:
        return null
    }
  }
  const getFormattedTime = (date) => {


    const getDate = new Date()
    const currentDate = Date.parse(getDate)
    const objDate = Date.parse(date)
    const timeDiff = currentDate - objDate
    let timeFrame
    let timeDigit

    switch (timeDiff < year) {
      case timeDiff >= month:
        // if (timeDiff / month < 11.5) return setFormattedDate(Math.round(timeDiff / year))
        // else return setFormattedDate(1)
        timeDigit = Math.round(timeDiff / month).toString()
        timeFrame = {
          y: 'mo',
          Y: 'Mo',
          yr: 'Mth',
          Yr: 'Mth',
          yrs_ago: 'mos ago',
          Years_ago: 'Months Ago'
        }
        break;
      case timeDiff >= week:
        timeDigit = Math.round(timeDiff / week).toString()
        timeFrame = {
          y: 'w',
          Y: 'W',
          yr: 'wk',
          Yr: 'Wk',
          yrs_ago: 'wks ago',
          Years_ago: 'Weeks Ago'
        }
        break;
      case timeDiff >= day:
        timeDigit = Math.round(timeDiff / day).toString()
        timeFrame = {
          y: 'd',
          Y: 'D',
          yr: 'da',
          Yr: 'Da',
          yrs_ago: 'days ago',
          Years_ago: 'Days Ago'
        }
        break;
      case timeDiff >= hour:
        timeDigit = Math.round(timeDiff / hour).toString()
        timeFrame = {
          y: 'h',
          Y: 'H',
          yr: 'hr',
          Yr: 'Hr',
          yrs_ago: 'hrs ago',
          Years_ago: 'Hours Ago'
        }
        break;
      case timeDiff >= minute:
        timeDigit = Math.round(timeDiff / minute).toString()
        timeFrame = {
          y: 'm',
          Y: 'M',
          yr: 'min',
          Yr: 'Min',
          yrs_ago: 'mins ago',
          Years_ago: 'Minutes Ago'
        }
        break;
      case timeDiff >= second:
        timeDigit = Math.round(timeDiff / second).toString()
        timeFrame = {
          y: 's',
          Y: 'S',
          yr: 'sec',
          Yr: 'Sec',
          yrs_ago: 'secs ago',
          Years_ago: 'Seconds Ago'
        }
        break;
      default:
        timeDigit = Math.round(timeDiff / year).toString()
        timeFrame = {
          y: 'y',
          Y: 'Y',
          yr: 'yr',
          Yr: 'Yr',
          yrs_ago: 'yrs ago',
          Yrs_Ago: 'Yrs Ago',
          years_ago: 'years ago',
          Years_Ago: 'Years Ago'
        }
    }
    return { timeDigit, timeFrame }
  }
  return { formatDate }
}