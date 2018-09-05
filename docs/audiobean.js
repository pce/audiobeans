var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BeanSound = /** @class */ (function () {
    /**
     *
     * @param src address of the media resource
     */
    function BeanSound(src) {
        this._canPlayResource = true;
        if (src) {
            this.setSource(src);
        }
    }
    /**
     *
     * @param src address of the media resource
     * @returns {BeanSound}
     */
    BeanSound.prototype.setSource = function (src) {
        this.src = src;
        return this;
    };
    BeanSound.prototype.getSource = function () {
        return this.src;
    };
    /**
     HAVE_NOTHING 	    0 	No information is available about the media resource.
     HAVE_METADATA 	    1 	Enough of the media resource has been retrieved that the metadata attributes are initialized. Seeking will no longer raise an exception.
     HAVE_CURRENT_DATA 	2 	Data is available for the current playback position, but not enough to actually play more than one frame.
     HAVE_FUTURE_DATA 	3 	Data for the current playback position as well as for at least a little bit of time into the future is available (in other words, at least two frames of video, for example).
     HAVE_ENOUGH_DATA 	4 	Enough data is available—and the download rate is high enough—that the media can be played through to the end without interruption.
     */
    BeanSound.prototype.isReady = function () {
        return this.audio.readyState >= 2;
    };
    /**
     *
     * @returns {boolean} member get re-setted in load method
     */
    BeanSound.prototype.canPlayResource = function () {
        return this._canPlayResource;
    };
    BeanSound.prototype.load = function () {
        this.audio.setAttribute("src", this.src);
        this.audio.load();
        if (this.getMimeType() === "") {
            this._canPlayResource = false;
        }
        return this;
    };
    BeanSound.prototype.setup = function () {
        this.audio = new Audio();
        this.load();
        this.registerEvents();
        return this;
    };
    BeanSound.prototype.isPlaying = function () {
        return !this.audio.paused;
    };
    BeanSound.prototype.registerEvents = function () {
        var _this = this;
        this.audio.addEventListener("ended", function () {
            _this.pause();
        }, false);
    };
    BeanSound.prototype.play = function () {
        return this.audio.play();
    };
    BeanSound.prototype.stop = function () {
        if (this.audio.currentTime > 0) {
            this.audio.currentTime = 0;
        }
        this.audio.pause();
    };
    BeanSound.prototype.pause = function () {
        this.audio.pause();
    };
    BeanSound.prototype.getPercent = function () {
        return this.audio.currentTime / this.audio.duration * 100;
    };
    BeanSound.prototype.getDuration = function () {
        // seconds
        return this.audio.duration;
    };
    BeanSound.prototype.getBuffered = function () {
        if (this.audio.buffered.length > 0) {
            return this.audio.buffered.end(this.audio.buffered.length - 1);
        }
        else {
            return 0;
        }
    };
    BeanSound.prototype.getSeekableTimeRanges = function () {
        return this.audio.seekable;
    };
    BeanSound.prototype.getMimeType = function () {
        var mimetype = "";
        if (this.audio.canPlayType("audio/ogg") == "probably" ||
            this.audio.canPlayType("audio/ogg") == "maybe") {
            mimetype = "ogg";
        }
        else if (this.audio.canPlayType("audio/wav") == "probably" ||
            this.audio.canPlayType("audio/wav") == "maybe") {
            mimetype = "wav";
        }
        else if (this.audio.canPlayType("audio/mp3") == "probably" ||
            this.audio.canPlayType("audio/mp3") == "maybe") {
            mimetype = "mp3";
        }
        return mimetype;
    };
    return BeanSound;
}());
var BeanSoundPlayerControls = /** @class */ (function () {
    function BeanSoundPlayerControls(beanSound) {
        if (beanSound) {
            this.setSound(beanSound);
        }
    }
    BeanSoundPlayerControls.prototype.setSound = function (beanSound) {
        this.beanSound = beanSound;
        return this.beanSound.setup();
    };
    BeanSoundPlayerControls.prototype.canPlayResource = function () {
        return this.beanSound !== null && this.beanSound.canPlayResource();
    };
    BeanSoundPlayerControls.prototype.play = function () {
        if (this.onPlay)
            this.onPlay();
        this.beanSound.play();
    };
    BeanSoundPlayerControls.prototype.stop = function () {
        this.beanSound.stop();
    };
    BeanSoundPlayerControls.prototype.pause = function () {
        this.beanSound.pause();
    };
    return BeanSoundPlayerControls;
}());
var BeanPlayer = /** @class */ (function (_super) {
    __extends(BeanPlayer, _super);
    function BeanPlayer(beanSound) {
        var _this = _super.call(this, beanSound) || this;
        _this._progressSelector = "";
        _this._bufferedProgressSelector = "";
        _this._toggleTextPlay = "&#9658;";
        _this._toggleTextPause = "&#9646;";
        _this._toggleTextSelector = "";
        _this._toggleClickSelector = "";
        _this._stopSelector = "";
        _this._playSelector = "";
        _this._sliderSelector = "";
        _this._imgSelector = "";
        _this._imgSrc = "";
        // necessary?
        _this._toggleButtonSelector = "";
        return _this;
    }
    BeanPlayer.prototype.getList = function () {
        return this._list;
    };
    BeanPlayer.prototype.setList = function (value) {
        this._list = value;
        return this;
    };
    BeanPlayer.prototype.setImage = function (value) {
        this._imgSrc = value;
        return this;
    };
    BeanPlayer.prototype.setImageSelector = function (value) {
        this._imgSelector = value;
        return this;
    };
    BeanPlayer.prototype.getStopSelector = function () {
        return this._stopSelector;
    };
    BeanPlayer.prototype.setStopSelector = function (value) {
        this._stopSelector = value;
        return this;
    };
    BeanPlayer.prototype.getPlaySelector = function () {
        return this._playSelector;
    };
    BeanPlayer.prototype.setPlaySelector = function (value) {
        this._playSelector = value;
        return this;
    };
    BeanPlayer.prototype.getProgressSelector = function () {
        return this._progressSelector;
    };
    BeanPlayer.prototype.setProgressSelector = function (value) {
        this._progressSelector = value;
        return this;
    };
    BeanPlayer.prototype.setBufferedProgressSelector = function (value) {
        this._bufferedProgressSelector = value;
        return this;
    };
    BeanPlayer.prototype.getToggleClickSelector = function () {
        return this._toggleClickSelector;
    };
    BeanPlayer.prototype.setToggleClickSelector = function (value) {
        this._toggleClickSelector = value;
        return this;
    };
    BeanPlayer.prototype.setSliderSelector = function (value) {
        this._sliderSelector = value;
        return this;
    };
    BeanPlayer.prototype.setToggleTextSelector = function (value) {
        this._toggleTextSelector = value;
        return this;
    };
    BeanPlayer.prototype.setup = function () {
        this.registerEvents();
    };
    BeanPlayer.prototype.updateProgress = function () {
        var value = this.beanSound.getPercent();
        return this.progessElem.style.width = value + "%";
    };
    BeanPlayer.prototype.updateSlider = function () {
        // only initital required
        e(this._sliderSelector).setAttribute("max", parseInt(this.beanSound.audio.duration * 10));
        e(this._sliderSelector).value = parseInt(this.beanSound.audio.currentTime * 10);
    };
    BeanPlayer.prototype.registerEvents = function () {
        var _this = this;
        this.beanSound.audio.addEventListener('error', function () {
            console && console.log && console.log('error loading audio:' + _this.beanSound.getSource());
        }, false);
        this.beanSound.audio.addEventListener("ended", function () {
            // return and play next if player is part of a list
            if (_this._list != null) {
                _this._list.next();
            }
            // onPlayerEnded -> ListNextEvent(this);
            // player ui
            if (_this._toggleTextSelector !== "") {
                e(_this._toggleTextSelector).innerHTML = _this._toggleTextPlay;
            }
        }, false);
        if (this._sliderSelector !== "") {
            this.beanSound.audio.addEventListener("timeupdate", function () {
                _this.updateSlider();
            }, false);
            e(this._sliderSelector).addEventListener("change", function () {
                // if (!this.beanSound.isSeekable()) return;
                _this.beanSound.audio.currentTime = e(_this._sliderSelector).value / 10;
            }, false);
        }
        if (this._progressSelector !== "") {
            this.progessElem = e(this._progressSelector);
            this.beanSound.audio.addEventListener("timeupdate", function () {
                _this.updateProgress();
            }, false);
            this.progessElem.addEventListener("click", function (event) {
                if (!_this.beanSound.isReady())
                    return;
                // if (!this.beanSound.isSeekable()) return;
                // console.log(this.progessElem.style.width);
                // this.beanSound.audio.currentTime = parseInt(event.clientX);
                // this.updateProgress();
            }, false);
        }
        if (this._bufferedProgressSelector !== "") {
            this.bufferedProgessElem = e(this._bufferedProgressSelector);
            this.beanSound.audio.addEventListener('progress', function () {
                var bufferedEnd = _this.beanSound.getBuffered();
                var duration = _this.beanSound.getDuration();
                if (duration > 0) {
                    _this.bufferedProgessElem.style.width = ((bufferedEnd / duration) * 100) + "%";
                }
            });
        }
        if (this._toggleClickSelector !== "") {
            e(this._toggleClickSelector).addEventListener("click", function () {
                if (_this.beanSound.isPlaying()) {
                    _this.pause();
                    if (_this._toggleTextSelector !== "") {
                        e(_this._toggleTextSelector).innerHTML = _this._toggleTextPlay;
                    }
                }
                else {
                    _this.play();
                    if (_this._toggleTextSelector !== "") {
                        e(_this._toggleTextSelector).innerHTML = _this._toggleTextPause;
                    }
                }
            }, false);
        }
        if (this._stopSelector !== "") {
            e(this._stopSelector).addEventListener("click", function () {
                _this.stop();
            }, false);
        }
        if (this._playSelector !== "") {
            e(this._playSelector).addEventListener("click", function () {
                _this.play();
            }, false);
        }
    };
    /**
     * ui update hook
     */
    BeanPlayer.prototype.onPlay = function () {
        if (this._imgSelector !== "" && this._imgSrc !== "") {
            e(this._imgSelector).src = this._imgSrc;
        }
    };
    return BeanPlayer;
}(BeanSoundPlayerControls));
var BeanListPlayer = /** @class */ (function () {
    function BeanListPlayer(playlist, loopmode) {
        // public static readonly LOOP_TRACK = 2;
        this.sounds = [];
        this.curIndex = 0;
        this.highlightClass = "track-highlight";
        this.highlightIndex = 0;
        this._loopMode = 0;
        this._toggleTextPlay = "&#9658;";
        this._toggleTextPause = "&#9646;";
        this._toggleTextSelector = ""; // idTextToggle
        this._toggleClickSelector = ""; // idToggle
        this._toggleButtonSelector = ""; // idButtonToggle
        this._nextButtonSelector = ""; // idNext
        this._prevButtonSelector = ""; // idPrev
        if (typeof playlist === "string") {
            this.setSoundsByName(playlist);
        }
        if (typeof loopmode !== "undefined") {
            this.setLoopMode(loopmode);
        }
    }
    BeanListPlayer.prototype.getLoopMode = function () {
        return this._loopMode;
    };
    BeanListPlayer.prototype.setLoopMode = function (value) {
        this._loopMode = value;
        return this;
    };
    BeanListPlayer.prototype.getToggleTextSelector = function () {
        return this._toggleTextSelector;
    };
    BeanListPlayer.prototype.setToggleTextSelector = function (value) {
        this._toggleTextSelector = value;
        return this;
    };
    BeanListPlayer.prototype.getToggleClickSelector = function () {
        return this._toggleClickSelector;
    };
    BeanListPlayer.prototype.setToggleClickSelector = function (value) {
        this._toggleClickSelector = value;
        return this;
    };
    BeanListPlayer.prototype.getToggleButtonSelector = function () {
        return this._toggleButtonSelector;
    };
    BeanListPlayer.prototype.setToggleButtonSelector = function (value) {
        this._toggleButtonSelector = value;
        return this;
    };
    BeanListPlayer.prototype.getNextButtonSelector = function () {
        return this._nextButtonSelector;
    };
    BeanListPlayer.prototype.setNextButtonSelector = function (value) {
        this._nextButtonSelector = value;
        return this;
    };
    BeanListPlayer.prototype.getPrevButtonSelector = function () {
        return this._prevButtonSelector;
    };
    BeanListPlayer.prototype.setPrevButtonSelector = function (value) {
        this._prevButtonSelector = value;
        return this;
    };
    BeanListPlayer.prototype.setSoundsByName = function (playlist) {
        var collection = document.getElementsByName(playlist);
        for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
            var playlistItem = collection_1[_i];
            var beanSoundId = playlistItem.id;
            if (!beanSoundId) {
                beanSoundId = playlist + "-" + this.curIndex++;
                playlistItem.setAttribute("id", beanSoundId);
                beanSoundId = "#" + beanSoundId;
            }
            else {
                beanSoundId = "#" + beanSoundId;
            }
            var beanplayer = new BeanPlayer(new BeanSound(playlistItem.getAttribute("data-sound")));
            var imgSrc = playlistItem.getAttribute("data-image");
            if (imgSrc) {
                beanplayer.setImage(imgSrc);
                // auto (#$playlist-image) or use setter?
                beanplayer.setImageSelector("#" + playlist + "-img");
                // console.log("setImageSelector #" + playlist + "-img");
            }
            beanplayer.setToggleClickSelector(beanSoundId)
                .setList(this)
                .setup();
            this.addSound(beanplayer);
        }
        this.curIndex = 0;
        return this;
    };
    BeanListPlayer.prototype.setup = function () {
        this.registerEvents();
    };
    BeanListPlayer.prototype.registerEvents = function () {
        var _this = this;
        if (this._toggleClickSelector !== "") {
            e(this._toggleClickSelector).addEventListener("click", function () {
                if (_this.sounds[_this.curIndex].beanSound.isPlaying()) {
                    _this.pause();
                    if (_this._toggleTextSelector !== "") {
                        e(_this._toggleTextSelector).innerHTML = _this._toggleTextPlay;
                    }
                }
                else {
                    _this.play();
                    if (_this._toggleTextSelector !== "") {
                        e(_this._toggleTextSelector).innerHTML = _this._toggleTextPause;
                    }
                }
            }, false);
        }
        if (this._nextButtonSelector !== "") {
            e(this._nextButtonSelector).addEventListener("click", function () {
                _this.next();
            }, false);
        }
        if (this._prevButtonSelector !== "") {
            e(this._prevButtonSelector).addEventListener("click", function () {
                _this.prev();
            }, false);
        }
    };
    BeanListPlayer.prototype.addSound = function (beanSound) {
        if (beanSound.canPlayResource()) {
            return this.sounds.push(beanSound);
        }
        return 0;
    };
    BeanListPlayer.prototype.play = function () {
        this.removeHighlightItem();
        this.highlightItem();
        this.sounds[this.curIndex].play();
    };
    BeanListPlayer.prototype.pause = function () {
        this.sounds[this.curIndex].pause();
    };
    BeanListPlayer.prototype.next = function () {
        // if (this.curIndex + 1 < this.sounds.length) {
        if (typeof this.sounds[this.curIndex + 1] !== 'undefined') {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex++;
            this.sounds[this.curIndex].play();
            this.highlightItem();
        }
        else {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex = 0;
            if (this._loopMode === BeanListPlayer.LOOP_NONE) {
                if (this._toggleTextSelector !== "") {
                    e(this._toggleTextSelector).innerHTML = this._toggleTextPlay;
                }
            }
            else if (this._loopMode === BeanListPlayer.LOOP_LIST) {
                this.sounds[this.curIndex].play();
                this.highlightItem();
            }
        }
    };
    BeanListPlayer.prototype.prev = function () {
        if (this.curIndex - 1 >= 0) {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex--;
            this.sounds[this.curIndex].play();
            this.highlightItem();
        }
        else {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex = this.sounds.length - 1;
            this.sounds[this.curIndex].play();
            this.highlightItem();
        }
    };
    BeanListPlayer.prototype.byIndex = function (index) {
        this.curIndex = index;
        return this.sounds[this.curIndex];
    };
    BeanListPlayer.prototype.highlightItem = function () {
        var selector = this.sounds[this.curIndex].getToggleClickSelector();
        if (selector !== "" && e(selector)) {
            e(selector).classList.add(this.highlightClass);
            this.highlightIndex = this.curIndex;
        }
    };
    BeanListPlayer.prototype.removeHighlightItem = function () {
        var selector = this.sounds[this.highlightIndex].getToggleClickSelector();
        if (selector !== "" && e(selector)) {
            var elem = e(selector);
            if (elem)
                elem.classList.remove(this.highlightClass);
        }
    };
    BeanListPlayer.LOOP_NONE = 0;
    BeanListPlayer.LOOP_LIST = 1;
    return BeanListPlayer;
}());
var e = function (selectors) { return document.querySelector(selectors); };
var root = typeof exports !== 'undefined' && exports !== null ? exports : this;
root.BeanSound = BeanSound;
root.BeanPlayer = BeanPlayer;
root.BeanListPlayer = BeanListPlayer;
