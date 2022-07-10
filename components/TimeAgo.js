import moment from "moment";

export const TimeAgo = ({ datetime }) => {
  return moment(datetime).fromNow()
}