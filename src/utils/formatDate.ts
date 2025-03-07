export function formatDate(date: Date|undefined, mode: string | null = null): string {
    if(!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based; adding 1
    const day = date.getDate().toString().padStart(2, '0');

    if(mode=='y') return `${year}`;
    return `${year}-${month}-${day}`;
}