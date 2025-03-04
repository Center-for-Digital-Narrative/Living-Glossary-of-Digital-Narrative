export function formatDate(date: Date|undefined): string {
    if(!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based; adding 1
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}