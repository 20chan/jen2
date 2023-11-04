import moment from 'moment';

export function formatDate(date: Date) {
  return moment(date).format('YYYY-MM-DD HH:mm');
}