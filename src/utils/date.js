import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function convertTimestampToDate(timestamp) {
	return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

export function formatRelativeDate(timestamp) {
	return formatDistanceToNow(convertTimestampToDate(timestamp), { addSuffix: true, locale: es });
}
