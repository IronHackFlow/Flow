import React from 'react';

function FormatDate({date}) {
  let formattedDate = ""

  const getDate = new Date()
  const currentDate = Date.parse(getDate)
  const objDate = Date.parse(date)
  const timeDiff = currentDate - objDate

  const year = 31536000000
  const month = 2592000000
  const week = 604800000
  const day = 86400000
  const hour = 3600000
  const minute = 60000
  const second = 1000

  if (timeDiff >= year) {
    formattedDate = `${Math.round(timeDiff / year)}y`
  } else if (timeDiff >= month && timeDiff < year) {
    if (timeDiff / month < 11.5) {
      formattedDate = `${Math.round(timeDiff / month)}m`
    } else {
      formattedDate = '1y'
    }
  } else if (timeDiff >= week && timeDiff < month * 2) {
    formattedDate = `${Math.round(timeDiff / week)}w`
  } else if (timeDiff >= day && timeDiff < week) {
    formattedDate = `${Math.round(timeDiff / day)}d`
  } else if (timeDiff >= hour && timeDiff < day) {
    formattedDate = `${Math.round(timeDiff / hour)}h`
  } else if (timeDiff >= minute && timeDiff < hour) {
    formattedDate = `${Math.round(timeDiff / minute)}min`
  } else if (timeDiff >= second && timeDiff < minute) {
    formattedDate = `${Math.round(timeDiff / second)}s`
  } else if (date === undefined || date === null) {
    formattedDate = "1y"
  }
  return <p>{formattedDate}</p>
}
export default FormatDate