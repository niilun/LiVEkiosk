export function playSound(doNotification, url, vol = 1.0) {
    if (doNotification) {
        const audio = new Audio(url)
        audio.volume = vol
        audio.play().catch((error) => {
            console.error('Error playing sound: ', error)
        });
    }
}