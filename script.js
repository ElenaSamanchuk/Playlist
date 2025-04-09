const carousel_img = document.querySelectorAll('.carousel_img');
const song = document.querySelectorAll('.song');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const play = document.querySelector('.play');
const pause = document.querySelector('.pause');
const audio = document.querySelector('.audio');
const progressContainer = document.querySelector('.progress-container');
const progress = document.querySelector('.progress');
const song_time_now = document.querySelector('.song_time-now');
const song_time_total = document.querySelector('.song_time-total');
const carousel = document.querySelector('.carousel');
let title = document.querySelector('.title_text');
let singer = document.querySelector('.singer_text');
let ind = 0;
let isPlay = false;
//console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
//console.log(audio.duration);

let audioCtx = 0;
const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext('2d');
let source = 0;
let analyser = 0;
let bufferLength = 0;
let dataArray = 0;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let array_title = ['Title1', 'Title2', 'Title3', 'Title4', 'Title5'];
let array_singer = ['Singer1', 'Singer2', 'Singer3', 'Singer4', 'Singer5'];
function switch_track() {
    if (isPlay == true) {
        audio.play();
        for (let i = 0; i < carousel_img.length; i++) {
            carousel_img[i].classList.remove('rotate');
            carousel_img[i].style.animationName = 'none';
        }
        carousel_img[ind].classList.add('rotate');
        carousel_img[ind].style.animationName = 'rotate';
    }
    layout();
}

carousel_img.forEach((item, index) => {
    item.addEventListener('click', () => {
            for (let i = 0; i < carousel_img.length; i++) {
                carousel_img[i].classList.remove('active');
                song[i].classList.remove('active');
            }
            item.classList.add('active');
            song[index].classList.add('active');
            audio.src = `mp3/${index}.mp3`;
            ind = index;
            change_text();
            switch_track();
            //console.log(ind, index, carousel_img[index].dataset.carousel_img, song[index].dataset.song);
            layout();
    });
});

song.forEach((item, index) => {
    item.addEventListener('click', () => {
            for (let i = 0; i < song.length; i++) {
                song[i].classList.remove('active');
                carousel_img[i].classList.remove('active');
            }
            item.classList.add('active');
            carousel_img[index].classList.add('active');
            audio.src = `mp3/${index}.mp3`;
            ind = index;
            change_text()
            switch_track();
            //console.log(ind, index, carousel_img[index].dataset.carousel_img, song[index].dataset.song);
            layout();
    });
});

prev.addEventListener('click', () => {
    for (let i = 0; i < carousel_img.length; i++) {
        carousel_img[i].classList.remove('active');
        song[i].classList.remove('active');
    }
    ind = (ind - 1 + carousel_img.length) % carousel_img.length;
    carousel_img[ind].classList.add('active');
    song[ind]?.classList.add('active');
    audio.src = `mp3/${ind}.mp3`;
    change_text()
    switch_track();
    //console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
    layout();
});

next.addEventListener('click', () => {
    for (let i = 0; i < carousel_img.length; i++) {
        carousel_img[i].classList.remove('active');
        song[i]?.classList.remove('active');
    }
    ind = (ind + 1) % carousel_img.length;
    carousel_img[ind].classList.add('active');
    song[ind]?.classList.add('active');
    audio.src = `mp3/${ind}.mp3`;
    change_text()
    switch_track();
    //console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
    layout();
});

play.addEventListener('click', () => {
    play.classList.remove('active');
    pause.classList.add('active');
    audio.play();
    isPlay = true;
    for (let i = 0; i < carousel_img.length; i++) {
        carousel_img[i].classList.remove('rotate');
        carousel_img[i].style.animationName = 'none';
    }
    carousel_img[ind].classList.add('rotate');
    carousel_img[ind].style.animationName = 'rotate';
    //console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
    change_text()
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 4096;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        draw();
        layout();
});

pause.addEventListener('click', () => {
    pause.classList.remove('active');
    play.classList.add('active');
    audio.pause();
    isPlay = false;
    for (let i = 0; i < carousel_img.length; i++) {
        carousel_img[i].classList.remove('rotate');
        carousel_img[i].style.animationName = 'none';
    }
    carousel_img[ind].style.animationName = 'none';
    change_text()
    //console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
    layout();
});

function totalTime() {
    let songMinutes = Math.floor(audio.duration / 60);
    songMinutes = (songMinutes >= 10) ? songMinutes : "0" + songMinutes;
    let songSeconds = Math.floor(audio.duration % 60);
    songSeconds = (songSeconds >= 10) ? songSeconds : "0" + songSeconds;
    song_time_total.innerHTML = `${songMinutes}:${songSeconds}`;
    let songMinutes2 = Math.floor(audio.currentTime / 60);
    songMinutes2 = (songMinutes2 >= 10) ? songMinutes2 : "0" + songMinutes2;
    let songSeconds2 = Math.floor(audio.currentTime % 60);
    songSeconds2 = (songSeconds2 >= 10) ? songSeconds2 : "0" + songSeconds2;
    song_time_now.innerHTML = `${songMinutes2}:${songSeconds2}`;
};

function updateProgress() {
    let duration = audio.duration;
    let currentTime = audio.currentTime;
    let progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    if (isNaN(audio.duration)){
        song_time_total.innerHTML = `00:00`;
        song_time_now.innerHTML = `00:00`;
    }
    else {
        totalTime();
    }
}

function setProgress(event) {
    let width = this.clientWidth;
    let clickX = event.offsetX;
    let duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);

audio.addEventListener("ended", () => {
    for (let i = 0; i < carousel_img.length; i++) {
        carousel_img[i].classList.remove('active');
        song[i]?.classList.remove('active');
    }
    ind = (ind + 1) % carousel_img.length;
    carousel_img[ind].classList.add('active');
    song[ind]?.classList.add('active');
    audio.src = `mp3/${ind}.mp3`;
    switch_track();
    //console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
});

function draw() {
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    const barWidth = ((WIDTH / 2) / bufferLength);
    let barHeight;
    let x = 0;
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `white`;
        canvasCtx.fillRect(WIDTH / 2 - x, HEIGHT / 2 - barHeight, barWidth, barHeight);
        x += barWidth;
    }
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `white`;
        canvasCtx.fillRect(x, HEIGHT / 2 - barHeight, barWidth, barHeight);
        x += barWidth;
    }
    x = 0;
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `white`;
        canvasCtx.fillRect(WIDTH / 2 - x, HEIGHT / 2, barWidth, barHeight);
        x += barWidth;
    }
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasCtx.fillStyle = `white`;
        canvasCtx.fillRect(x, HEIGHT / 2, barWidth, barHeight);
        x += barWidth;
    }
    requestAnimationFrame(draw);
}

function layout() {
    const xOffsetStep = 100;
    const count = carousel_img.length;
    const scaleStep = 0.85;
    const opacityStep = 0.5;
    for(let i = 0; i < carousel_img.length; i++){
      img = carousel_img[i];
      const sign = Math.sign(i - ind);
      let xOffset = (i - ind) * xOffsetStep;
      if(i !== ind) {
        xOffset = xOffset + 80 * sign;
      }
      const scale = scaleStep ** Math.abs(i - ind);
      const rotateY = i === ind ? 0 : 30 * -sign;
      img.style.transform = `perspective(800px) translateX(${xOffset}px) scale(${scale})`;
      let opacity = opacityStep ** Math.abs(i - ind);
      if(Math.abs(i - ind) > 2) {
        opacity = 0
      }
      img.style.opacity = opacity;
      img.style.zIndex = count - Math.abs(ind - i);
    }
}
layout();

carousel.addEventListener('wheel', (event) => {
    //console.log(event.deltaY);
    if (event.deltaY < 0) {
        if (ind > 0) {
            ind--;
        } else {
            ind = carousel_img.length - 1;
        } 
    }
    if (event.deltaY > 0) {
        if (ind < carousel_img.length-1) {
            ind++;
        } else {
            ind = 0;
        } 
    }
    for (let i = 0; i < carousel_img.length; i++) {
        carousel_img[i].classList.remove('active');
        song[i].classList.remove('active');
    }
    carousel_img[ind].classList.add('active');
    song[ind].classList.add('active');
    audio.src = `mp3/${ind}.mp3`;
    change_text()
    switch_track();
    //console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
    layout();
});

let clientXstart; 
let clientXend; 

carousel.addEventListener('touchstart', (event) => {
    //console.log(event.touches[0].clientX);
    clientXstart = event.touches[0].clientX;
});
  
carousel.addEventListener('touchend', (event) => {
    //console.log(event.changedTouches[0].clientX);
    clientXend = event.changedTouches[0].clientX;
    mobSwipe();
});

function mobSwipe() {
    for (let i = 0; i < carousel_img.length; i++) {
        carousel_img[i].classList.remove('active');
    }
    for (let i = 0; i < song.length; i++) {
        song[i].classList.remove('active');
        
        //console.log('swipe');
    }
    if (clientXstart < clientXend) {
        if (ind > 0) {
            ind--;
        } else {
            ind = carousel_img.length - 1;
        } 
    }
    if (clientXstart > clientXend) {
        if (ind < carousel_img.length-1) {
            ind++;
        } else {
            ind = 0;
        } 
    }
    carousel_img[ind].classList.add('active');
    song[ind]?.classList.add('active');
    audio.src = `mp3/${ind}.mp3`;
    change_text();
    switch_track();
    //console.log(ind, carousel_img[ind].dataset.carousel_img, song[ind].dataset.song);
    layout();
}

progressContainer.addEventListener("touchend", (event) => {
    let width = Number(progressContainer.clientWidth);
    let clickX = Number(event.changedTouches[0].clientX);
    let duration = Number(audio.duration);
    if (isPlay) {
        audio.currentTime = (clickX / width) * duration;
    }
});

function change_text() {
    title.innerHTML = `${array_title[ind]}`;
    //console.log(title);
    singer.innerHTML = `${array_singer[ind]}`;
    //console.log(singer);
}