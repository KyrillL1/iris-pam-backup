export function truncateId(id: string, length: number = 8): string {
    if (id.length <= length) {
        return id;
    }
    const end = id.slice(-Math.floor(length / 2));
    return `...${end}`;
}