import moment from 'moment';

export function formatDate(date: Date) {
  return moment(date).add(9, 'h').format('YYYY-MM-DD HH:mm');
}