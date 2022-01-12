// STRING INPUTS: 
//   "MMMM Dth YYYY"
//   "MMMM D YYYY"
//   "m"   "M"   " m"   " M"
//   "mm"   "Mm"   " mm"   " Mm"
//   "mm_ago"   "Mm_Ago"   " mm_ago"   " Mm_Ago"
//   "mmmm_ago"   "Mmmm_Ago"   " mmmm_ago"   " Mmmm_Ago"

export default function useFormatDate() {
  const year = 31536000000
  const month = 2592000000
  const week = 604800000
  const day = 86400000
  const hour = 3600000
  const minute = 60000
  const second = 1000

  const formatDate = (date, string) => {
    if (date == null || string == null) return
    else if (string === "MMMM_Dth_YYYY" || string === "MMMM_D_YYYY") return formatMonthDYear(date, string)
    else {
      const { timeFrame, timeDigit } = getTimeAndCalendarStrings(date)
      const format = getCalendarAbreviatedString(string, timeFrame)
      if (string.charAt(0) === " ") return `${timeDigit} ${format}`
      else return `${timeDigit}${format}`
    }
  }

  const formatMonthDYear = (date, string) => {
    const [year, month, day] = date.slice(0, 10).split('-')
    const monthName = getMonthString(month)
    if (string.indexOf('t') > 0) return `${monthName} ${day}th ${year}`
    else return `${monthName} ${day}, ${year}`
  }

  const getCalendarAbreviatedString = (string, timeFrame) => {
    if (timeFrame == null) return
    let format = ""
    for (const [key] of Object.entries(timeFrame)) {
      if (key === string) {
        format = `${timeFrame[key]}`
      }
    }
    return format
  }

  const getMonthString = (num, partial) => {
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

  const getTimeAndCalendarStrings = (date) => {
    const getDate = new Date()
    const currentDate = Date.parse(getDate)
    const objDate = Date.parse(date)
    const timeDiff = currentDate - objDate
    let timeFrame = null
    let timeDigit = 0
    let plural

    switch (timeDiff < year) {
      case timeDiff >= month:
        // if (timeDiff / month < 11.5) return setFormattedDate(Math.round(timeDiff / year))
        // else return setFormattedDate(1)
        timeDigit = Math.round(timeDiff / month).toString()
        plural = timeDigit === 1 ? "" : "s"
        timeFrame = {
          'm': 'm',
          'M': 'M',
          'mm': 'mo',
          'Mm': 'Mo',
          'mm_ago': `mo${plural} ago`,
          'Mm_Ago': `Mo${plural} Ago`,
          'mmmm_ago': `mo${plural} ago`,
          'Mmmm_Ago': `Month${plural} Ago`
        }
        break;
      case timeDiff >= week:
        timeDigit = Math.round(timeDiff / week).toString()
        plural = timeDigit === 1 ? "" : "s"
        timeFrame = {
          'm': 'w',
          'M': 'W',
          'mm': 'wk',
          'Mm': 'Wk',
          'mm_ago': `wk${plural} ago`,
          'Mm_Ago': `Wk${plural} Ago`,
          'mmmm_ago': `week${plural} ago`,
          'Mmmm_Ago': `Week${plural} Ago`
        }
        break;
      case timeDiff >= day:
        timeDigit = Math.round(timeDiff / day).toString()
        plural = timeDigit === 1 ? "" : "s"
        timeFrame = {
          'm': 'd',
          'M': 'D',
          'mm': 'day',
          'Mm': 'Day',
          'mm_ago': `day${plural} ago`,
          'Mm_Ago': `Day${plural} Ago`,
          'mmmm_ago': `day${plural} ago`,
          'Mmmm_Ago': `Day${plural} Ago`
        }
        break;
      case timeDiff >= hour:
        timeDigit = Math.round(timeDiff / hour).toString()
        plural = timeDigit === 1 ? "" : "s"
        timeFrame = {
          'm': 'h',
          'M': 'H',
          'mm': 'hr',
          'Mm': 'Hr',
          'mm_ago': `hr${plural} ago`,
          'Mm_Ago': `Hr${plural} Ago`,
          'mmmm_ago': `hour${plural} ago`,
          'Mmmm_Ago': `Hour${plural} Ago`
        }
        break;
      case timeDiff >= minute:
        timeDigit = Math.round(timeDiff / minute).toString()
        plural = timeDigit === 1 ? "" : "s"
        timeFrame = {
          'm': 'min',
          'M': 'Min',
          'mm': 'min',
          'Mm': 'Min',
          'mm_ago': `min${plural} ago`,
          'Mm_Ago': `Min${plural} Ago`,
          'mmmm_ago': `minute${plural} ago`,
          'Mmmm_Ago': `Minute${plural} Ago`
        }
        break;
      case timeDiff >= second:
        timeDigit = Math.round(timeDiff / second).toString()
        plural = timeDigit === 1 ? "" : "s"
        timeFrame = {
          'm': 's',
          'M': 'S',
          'mm': 'sec',
          'Mm': 'Sec',
          'mm_ago': `sec${plural} ago`,
          'Mm_Ago': `Sec${plural} Ago`,
          'mmmm_ago': `second${plural} ago`,
          'Mmmm_Ago': `Second${plural} Ago`
        }
        break;
      default:
        timeDigit = Math.round(timeDiff / year).toString()
        plural = timeDigit === 1 ? "" : "s"
        timeFrame = {
          y: 'y',
          Y: 'Y',
          yr: 'yr',
          Yr: 'Yr',
          yrs_ago: `yr${plural} ago`,
          Yrs_Ago: `Yr${plural} Ago`,
          years_ago: `year${plural} ago`,
          Years_Ago: `Year${plural} Ago`
        }
    }
    return { timeDigit, timeFrame }
  }

  return { formatDate }
}