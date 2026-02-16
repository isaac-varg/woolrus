import dayjs from "dayjs"

// https://day.js.org/docs/en/display/format 
const dateFormat = 'ddd, MMM DD - hh:mm a'

export const formatDate = (date: Date): string => {

  return dayjs(date).format(dateFormat)
}
