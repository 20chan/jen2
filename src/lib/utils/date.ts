import moment from 'moment-timezone';
import 'moment/locale/ko';

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

export function getDay(date: Date) {
  const m = moment(date);
  m.locale('kr');
  return m.format('ddd');
}

export { moment };