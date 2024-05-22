document.addEventListener('DOMContentLoaded', (event) => {
    const videoUrlInput = document.getElementById('videoUrl');
    const captionTextInput = document.getElementById('captionText');
    const timestampInput = document.getElementById('timestamp');
    const addCaptionBtn = document.getElementById('addCaptionBtn');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const videoElement = document.getElementById('video');
    const captionsList = document.getElementById('captionsList');
    const videoCaptionDiv = document.getElementById('video-caption');

    let captions = [];

    addCaptionBtn.addEventListener('click', () => {
        const videoUrl = videoUrlInput.value;
        const captionText = captionTextInput.value;
        const timestamp = timestampInput.value;

        if (videoUrl && captionText && isValidTimestamp(timestamp)) {
            // Set video source if not already set or changed
            if (!videoElement.src || videoElement.src !== videoUrl) {
                videoElement.querySelector('source').src = videoUrl;
                videoElement.load();
            }

            // Add caption to the list
            const timestampInSeconds = convertTimestampToSeconds(timestamp);
            captions.push({ text: captionText, time: timestampInSeconds });
            updateCaptionsList();

            // Clear input fields
            captionTextInput.value = '';
            timestampInput.value = '';
        } else {
            alert('Please enter a valid video URL, caption text, and timestamp.');
        }
    });

    playBtn.addEventListener('click', () => {
        videoElement.play();
    });

    pauseBtn.addEventListener('click', () => {
        videoElement.pause();
    });

    videoElement.addEventListener('timeupdate', () => {
        const currentTime = videoElement.currentTime;
        const caption = captions.find(c => Math.abs(currentTime - c.time) < 0.5);
        if (caption) {
            showCaption(caption.text);
        }
    });

    function updateCaptionsList() {
        captionsList.innerHTML = '';
        captions.forEach((caption, index) => {
            const captionDiv = document.createElement('div');
            captionDiv.classList.add('caption-item');
            captionDiv.textContent = `(${formatTimestamp(caption.time)}) ${caption.text}`;
            captionsList.appendChild(captionDiv);
        });
    }

    function showCaption(text) {
        videoCaptionDiv.textContent = text;
        videoCaptionDiv.style.display = 'block';
        setTimeout(() => {
            videoCaptionDiv.style.display = 'none';
        }, 3000);
    }

    function isValidTimestamp(timestamp) {
        const regex = /^(\d{1,2}):([0-5]?[0-9]):([0-5]?[0-9])$/;
        return regex.test(timestamp);
    }

    function convertTimestampToSeconds(timestamp) {
        const parts = timestamp.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function formatTimestamp(seconds) {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }
});
