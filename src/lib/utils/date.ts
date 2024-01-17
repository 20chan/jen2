import moment from 'moment-timezone';
import 'moment/locale/ko';

moment.tz.setDefault('Asia/Seoul');
moment.tz('Asia/Seoul').zoneAbbr();

export function formatDate(date: Date) {
  return moment(date).format('YYYY-MM-DD HH:mm');
}

// client side에서 사용 시 timezone이 동작하지 않는다. 수동으로 9시간을 더하는 멍첨함
export function formatDateKr(date: Date) {
  return moment(date).add(9, 'h').format('YYYY-MM-DD HH:mm');
}

export function formatDateKrSimple(date: Date) {
  return moment(date).add(9, 'h').format('MM-DD HH:mm');
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