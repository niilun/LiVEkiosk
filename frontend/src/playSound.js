export function playSound(doNotification, url) {
    if (doNotification) {
        const audio = new Audio(url);
        audio.play().catch((error) => {
            console.error('Error playing sound: ', error);
        });
    }
}