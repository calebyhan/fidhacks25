export function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
}

export function getFormattedTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}