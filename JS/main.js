import data from "../assets/data/songs.js"

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// element node
var sliderList = $('.overview__slider-list')
var songsList = $('.overview__list-song')

const audioElement = $('.control__audio');
const cdThumb = $('.control__left-song-thumb');
const nameSongElement = $('.control__left-song-name');
const authorElement = $('.control__left-song-wrap-author');
const totalTimeElement = $('.duration__total-time');
const durationBar = $('.duration__bar');

const randomBtn = $('.icon-ramdom');
const loopBtn = $('.icon-loop');
const volumeBar = $('.control__right-volume-bar');

const app = {
    currentIndex: 0,
    isPlay: false,
    isRandom: false,
    isLoop: false,

    getSliderSong: function () {

        var html = '';
        data.mySongs.forEach(function(song) {
            html += `
            <li class="overview__slider-item third">
                <img src="${song.img}" alt="" class="overview__slider-img">
            </li>
            `
        })
        sliderList.innerHTML = html;
    },

    renderSongs: function() {

        var html = '';
        data.mySongs.forEach(function(song, index) {
            
            html += `
                <li class="overview__song-item" data-index='${index}'>
                    <div class="song__detail">
                        <img src="${song.img}" alt="" class="song__thumb">
                        <div class="song__infor">
                            <h3 class="song__name">${song.name}</h3>
                            <p class="song__author">
                                ${authorsStrToHTML(song.singer)}
                            </p>
                        </div>
                    </div>
                    <span class="song__duration">${song.time}</span>
                    <div class="song__action">
                        <span class="song__action-wrap-icon popup-top" style="--content:'Phát cùng lời bài hát';--pseudo-element-width: 124px">
                            <i class="fas fa-microphone"></i>
                        </span>
                        <span class="song__action-wrap-icon popup-top favourite" style="--content:'Xóa khỏi thư viện'; --pseudo-element-width: 124px">
                            <i class="fas fa-heart"></i>
                        </span>
                        <span class="song__action-wrap-icon popup-top other-icon" style="--content:'Khác'; --left: -50%">...</span>
                    </div>
                </li>
            `;
        })
        songsList.innerHTML = html;
    },

    denfineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return data.mySongs[this.currentIndex]
            }
        })
    },

    loadCurrentSong: function() {

        audioElement.src = this.currentSong.path
        cdThumb.src = this.currentSong.img
        nameSongElement.textContent = this.currentSong.name
        authorElement.innerHTML = authorsStrToHTML(this.currentSong.singer)
        
    },

    handleEvent: function() {
        const _this = this;
        const itemSong = $$('.overview__song-item');

        

        // active current song
        function activeCurrentSong() {
            itemSong.forEach(function(song, index) {
                song.classList.remove('active');
                if(index === _this.currentIndex) {
                    song.classList.add('active');
                }
            })
        }

        // rotate cdthumbneil
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        // pause and play
        var audioElement = $('.control__audio');
        var pausePlayBtn = $('.control__wrap-pause-play');
        var durationbarElement = $('.duration__bar');

        // tua audio
        durationbarElement.onchange = function() {
            audioElement.currentTime = (audioElement.duration * this.value / 100);
        }

        // play and pause
        pausePlayBtn.onclick = function() {
            this.classList.toggle('play')
            if(this.classList.contains('play')) {
                audioElement.play();
                _this.isPlay = true;
                cdThumbAnimate.play();
            } else {
                audioElement.pause();
                _this.isPlay = false;
                cdThumbAnimate.pause();
            }
        }

        // update duration bar
        const currentTimeElement = $('.duration__curent-time');
        audioElement.ontimeupdate = function() {
            durationbarElement.value = `${(this.currentTime / this.duration * 100) || 0}`
            // update current time
            currentTimeElement.innerHTML = formatTimeToHTML(this.currentTime);
        }

        // next and pre
        var nextSongBtn = $('.icon-next')
        var preSongBtn = $('.icon-pre')
        
        nextSongBtn.onclick = function() {
            if(_this.isRandom) {
                _this.currentIndex = getRandomSong(_this.currentIndex, data.mySongs.length)
            } else {
                _this.currentIndex++;
            }

            if(app.currentIndex >= data.mySongs.length) {
                app.currentIndex = 0
            }

            app.loadCurrentSong();
            
            audioElement.play();
            pausePlayBtn.classList.add('play');
            activeCurrentSong()

        }

        preSongBtn.onclick = function() {
            if(_this.isRandom) {
                _this.currentIndex = getRandomSong(_this.currentIndex, data.mySongs.length)
            } else {
                _this.currentIndex--;
            }

            if(app.currentIndex < 0) {
                app.currentIndex = data.mySongs.length - 1;
            }
            app.loadCurrentSong();
            
            audioElement.play();
            pausePlayBtn.classList.add('play');
            activeCurrentSong()

        }

        // handle random
        randomBtn.onclick = function(e) {
            if(this.classList.contains('active')) {
                this.classList.remove('active')
                _this.isRandom = false
            } else {
                this.classList.add('active')
                _this.isRandom = true
            }
        }

        // handle loop
        loopBtn.onclick = function(e) {
            if(this.classList.contains('active')) {
                this.classList.remove('active')
                _this.isLoop = false
            } else {
                this.classList.add('active')
                _this.isLoop = true
            }
            console.log(_this.isLoop)
        }

        // handle ended audio
        audioElement.onended = function() {
            if(_this.isLoop) {
                audioElement.play()
            } else {
                nextSongBtn.click()
            }
        }

        // change volumn
        volumeBar.onchange = function() {
            audioElement.volume = this.value/10
        }
        
        // click play song
        itemSong.forEach(function(songElement, index) {
            songElement.onclick = function(e) {
                // xử lý khi bấm vào tác giả
                if(e.target.closest('.song__author')) {
                    
                }
                // xử lý khi bấm vào các action
                else if (e.target.closest('.song__action')) {

                } 
                else {
                    _this.currentIndex = index
                    _this.loadCurrentSong()
                    audioElement.play()
                    pausePlayBtn.classList.add('play')
                }
                activeCurrentSong()
            }
        })

    },

    start: function () {

        this.denfineProperties()
        this.getSliderSong();
        this.renderSongs();
        this.loadCurrentSong();
        this.handleEvent();

    

        setInterval(function() {
            changSlider()
        }, 2000);
    }
}

app.start();



// handle slider change
var sliderItem = $$('.overview__slider-item')

var indexSliderItem = 1;
var countSliderItem = sliderItem.length - 1

sliderItem[0].classList.toggle('third')
sliderItem[0].classList.toggle('first')
sliderItem[1].classList.toggle('third')
sliderItem[1].classList.toggle('second')


function changSlider() {
    if (indexSliderItem > countSliderItem) {
        indexSliderItem = 0;
    }


    // handel second and third
    if (indexSliderItem == countSliderItem) {
        // current
        replaceClass(sliderItem[indexSliderItem], 'second', 'first')

        // last
        replaceClass(sliderItem[indexSliderItem - 1], 'first', 'third')

        // next
        replaceClass(sliderItem[indexSliderItem - indexSliderItem], 'third', 'second')

    } else if (indexSliderItem == 0) {
        // current
        replaceClass(sliderItem[indexSliderItem], 'second', 'first')

        // last
        replaceClass(sliderItem[indexSliderItem + countSliderItem], 'first', 'third')

        // next
        replaceClass(sliderItem[indexSliderItem + 1], 'third', 'second')

    } else {
        // current
        replaceClass(sliderItem[indexSliderItem], 'second', 'first')

        // last
        replaceClass(sliderItem[indexSliderItem - 1], 'first', 'third')

        // next
        replaceClass(sliderItem[indexSliderItem + 1], 'third', 'second')
    }
    indexSliderItem++
}

// initial function
function replaceClass(element, classRemove, classAdd) {
    element.classList.remove(classRemove);
    element.classList.add(classAdd);
}

function authorsStrToHTML(string) {
    string = string.split(', ');
    var html = '';
    for(var i = 0; i < string.length; ++i) {
        html += `<a href="">${string[i]}</a>`;
        if (i < string.length - 1) {
            html += ', ';
        }
    }
    return html;
}

function formatTimeToHTML(number) {
    if(number <= 9.5) {
        return `00:0${number.toFixed(0)}`;
    } else if (number <= 59.5) {
        return `00:${number.toFixed(0)}`
    } else if ((number/60).toFixed(0) < 10) {
        var tg = (number % 60).toFixed(0)
        if(tg <= 9.5) tg = `0${tg}`
        return `0${(number/60).toFixed(0)}:${tg}`;
    } else {
        var tg = (number % 60).toFixed(0)
        if(tg <= 9.5) tg = `0${tg}`
        return `${(number/60).toFixed(0)}:${(number % 60).toFixed(0)}`;
    }
}

function getRandomSong(currentIndex, maxIndex) {
    var numSong;
    do {
        numSong = Math.ceil(Math.random(0,maxIndex) * maxIndex) - 1
    } while (numSong === currentIndex);
    return numSong;
}



