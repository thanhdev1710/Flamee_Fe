import { formatDistanceToNow, format, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatLastSeen(dateStr?: string | Date | null, isOnline?: boolean): string {
    if (isOnline) return "Đang hoạt động";
    if (!dateStr) return "Ngoại tuyến";

    const date = new Date(dateStr);
    // Safety check: Nếu ngày giờ lỗi -> trả về Ngoại tuyến
    if (!isValid(date)) return "Ngoại tuyến";

    const diff = Date.now() - date.getTime();

    // Nếu < 2 phút coi như vừa truy cập
    if (diff < 2 * 60 * 1000) return "Vừa truy cập";

    return "Hoạt động " + formatDistanceToNow(date, { addSuffix: true, locale: vi });
}

export function formatMessageTime(dateStr?: string | Date | null) {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    // Safety check: Nếu ngày giờ lỗi -> trả về rỗng (không crash app)
    if (!isValid(date)) return "";

    return format(date, 'HH:mm');
}