document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');

    startBtn.addEventListener('click', () => {
        // User ko 2.html pe redirect karna
        window.location.href = 'Activity.html';
    });
});