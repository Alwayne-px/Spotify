const fileInput = document.getElementById("fileInput");
const playlist = document.getElementById("playlist");
const audioPlayer = document.getElementById("audioPlayer");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const playPauseBtn = document.getElementById("playPause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const albumCover = document.getElementById("albumCover");
const loopBtn = document.getElementById("loop");
const shuffleBtn = document.getElementById("shuffle");

const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.querySelector(".progress");
const progressCircle = document.querySelector(".progress-circle");

let currentSongIndex = 0;
let isShuffle = false;
let isLooping = 0;
let isDragging = false;

let songs = [
  { title: "PALAGI by Tj Monterde", src: "PALAGI.mp3", category: "Love" },
  { title: "Marilag by Dionela", src: "Marilag.mp3", category: "Love" },
  { title: "Dilaw by Maki", src: "Dilaw.mp3", category: "Love" },
  {
    title: "Sa Bawat Sandali by Amil Sol",
    src: "Sa Bawat Sandali.mp3",
    category: "Love",
  },
  { title: "My Day by HELLMERRY", src: "My Day.mp3", category: "Love" },
  {
    title: "Para Sa Akin by Jason Dhakal",
    src: "Para Sa Akin.mp3",
    category: "Love",
  },
  {
    title: "Take All The Love by Arthur nery",
    src: "Take All The Love.mp3",
    category: "Love",
  },
  { title: "Sining by Dionela ft jay r", src: "Sining.mp3", category: "Love" },
  { title: "ikot by Over October", src: "ikot.mp3", category: "Love" },
  { title: "Pantropiko by BINI", src: "Pantropiko.mp3", category: "Love" },
  {
    title: "Museo by Dionela Eliza Maturan",
    src: "Museo.mp3",
    category: "Love",
  },
  { title: "Boyfriend by ALLMO$T", src: "Boyfriend.mp3", category: "Love" },
  { title: "I Want You by Saphira", src: "I Want You.mp3", category: "Love" },
  { title: "Miss Miss by Rob Deniel", src: "Miss Miss.mp3", category: "Love" },
  {
    title: "Cherry On Top by BINI",
    src: "Cherry On Top .mp3",
    category: "Love",
  },
  { title: "RomCom by Rob Deniel", src: "RomCom.mp3", category: "Love" },
  {
    title: "Walang kapalit by Arthur Miguel",
    src: "Walang kapalit.mp3",
    category: "Love",
  },
  { title: "711 by TONEEJAY", src: "711 .mp3", category: "Love" },
  {
    title: "Salamin, Salamin by BINI",
    src: "Salamin, Salamin.mp3",
    category: "Love",
  },
  { title: "Leonora by SUGARCANE", src: "Leonora.mp3", category: "Love" },
];

const albumCovers = [
  "lablab8.jpg",
  "album2.jpg",
  "album3.jpg",
  "album4.jpg",
  "album5.jpg",
];

// Get a random album cover
function getRandomCover() {
  return albumCovers[Math.floor(Math.random() * albumCovers.length)];
}

// Play a song
function playSong(index) {
  if (index < 0 || index >= songs.length) return;

  currentSongIndex = index;
  let song = songs[index];
  audioPlayer.src = song.src;
  songTitle.textContent = song.title;
  artistName.textContent = song.category || "Unknown Genre";
  albumCover.src = getRandomCover();

  audioPlayer.play();
  playPauseBtn.innerHTML = "❚❚";
}

// Update Playlist UI
function updatePlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${song.category} - ${song.title}`;
    listItem.dataset.index = index;
    playlist.appendChild(listItem);
    listItem.addEventListener("click", () => playSong(index));
  });
}
updatePlaylist();

// Play/Pause Button
playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.innerHTML = "⏸️";
  } else {
    audioPlayer.pause();
    playPauseBtn.innerHTML = " ▷";
  }
});

// Previous Song Button
prevBtn.addEventListener("click", () => {
  let newIndex = isShuffle
    ? getRandomIndex()
    : (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(newIndex);
});

// Next Song Button
nextBtn.addEventListener("click", () => {
  let newIndex = isShuffle
    ? getRandomIndex()
    : (currentSongIndex + 1) % songs.length;
  playSong(newIndex);
});

// Shuffle Mode
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.textContent = isShuffle ? "🔀 On" : "🔀 Off";
  shuffleBtn.style.color = isShuffle ? "magenta" : "white";
});

// Loop Mode
loopBtn.addEventListener("click", () => {
  isLooping = (isLooping + 1) % 3;
  loopBtn.textContent = ["🔁 Off", "🔂 One", "🔁 All"][isLooping];
});

// Format time (MM:SS)
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update progress bar & time display
function updateProgress() {
  let current = audioPlayer.currentTime;
  let duration = audioPlayer.duration || 1; // Avoid division by zero

  currentTimeDisplay.textContent = formatTime(current);
  durationDisplay.textContent = formatTime(audioPlayer.duration);
  let percentage = (current / duration) * 100;
  progressFill.style.width = `${percentage}%`;
  progressCircle.style.left = `${percentage}%`;
}

// Load metadata to get song duration
audioPlayer.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatTime(audioPlayer.duration);
});

// Update progress as song plays
audioPlayer.addEventListener("timeupdate", updateProgress);

// Clickable progress bar to seek
progressBar.addEventListener("click", (e) => {
  let rect = progressBar.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;
  let percentage = offsetX / rect.width;
  audioPlayer.currentTime = percentage * audioPlayer.duration;
});

// Dragging progress circle for seeking
progressCircle.addEventListener("mousedown", (e) => {
  isDragging = true;
  document.body.style.userSelect = "none"; // Prevents text selection
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let rect = progressBar.getBoundingClientRect();
    let offsetX = e.clientX - rect.left;
    let percentage = Math.max(0, Math.min(1, offsetX / rect.width));

    progressFill.style.width = `${percentage * 100}%`;
    progressCircle.style.left = `${percentage * 100}%`;
    audioPlayer.currentTime = percentage * audioPlayer.duration;
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.userSelect = ""; // Re-enable text selection
});

// Auto-Play Next Song (Handles Loop & Shuffle)
audioPlayer.addEventListener("ended", () => {
  if (isLooping === 1) {
    playSong(currentSongIndex);
  } else if (isShuffle) {
    playSong(getRandomIndex());
  } else {
    playSong((currentSongIndex + 1) % songs.length);
  }
});

// Get Random Index for Shuffle Mode
function getRandomIndex() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex === currentSongIndex);
  return randomIndex;
}

// Rotate album cover when playing
audioPlayer.addEventListener("play", () => {
  albumCover.classList.add("rotating");
});

audioPlayer.addEventListener("pause", () => {
  albumCover.classList.remove("rotating");
});

audioPlayer.addEventListener("ended", () => {
  albumCover.classList.remove("rotating");
});

// Update media session metadata
if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.category || "Unknown Genre",
    artwork: [{ src: albumCover.src, sizes: "512x512", type: "image/png" }],
  });
}

// Background Playback using Web Workers
if (window.Worker) {
  const worker = new Worker("worker.js");

  worker.postMessage("keepAlive");

  worker.onmessage = (event) => {
    if (event.data === "stillPlaying") {
      console.log("Audio still playing...");
    }
  };
}
