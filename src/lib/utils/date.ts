import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');

export function formatDate(date: Date) {
  return moment(date).format('YYYY-MM-DD HH:mm');
}

export function formatDateDiff(date: Date) {
  return moment(date).fromNow();
}

export function dateDiff(date: Date) {
  return moment(date).diff(moment(), 'd');
}

export { moment };