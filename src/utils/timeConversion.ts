export default (minutes: number) => {
    const seconds = minutes * 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (seconds < 60) {
        return seconds.toFixed(1) + " Seconds";
    } else if (minutes < 60) {
        return minutes.toFixed(1) + " Minutes";
    } else if (hours < 24) {
        return hours.toFixed(1) + " Hours";
    } else {
        return days.toFixed(1) + " Days";
    }
};
