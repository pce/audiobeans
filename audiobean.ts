class BeanSound {


    public audio;
    private src:string;

    private _canPlayResource:boolean = true;

    /**
     *
     * @param src address of the media resource
     */
    constructor(src) {
        if (src) {
            this.setSource(src);
        }
    }

    /**
     *
     * @param src address of the media resource
     * @returns {BeanSound}
     */
    public setSource(src): BeanSound {
        this.src = src;
        return this;
    }

    public getSource(): string {
        return this.src;
    }

    public canPlayResource(): boolean {
        return this._canPlayResource;
    }

    public load() : BeanSound {
        this.audio.setAttribute("src", this.src);
        this.audio.load();
        if (this.getMimeType() === "") {
            this._canPlayResource = false;
        }
        return this;
    }

    public setup() : BeanSound {
        this.audio = new Audio();
        this.load();
        this.registerEvents();
        return this;
    }

    isPlaying() {
        return !this.audio.paused;
    }

    registerEvents() {
        this.audio.addEventListener("ended", () => {
            this.pause();
        }, false);
    }

    play(): Promise<void> {
        return this.audio.play();
    }

    stop(): void {
        if (this.audio.currentTime > 0) {
            this.audio.currentTime = 0;
        }
        this.audio.pause();
    }

    pause(): void {
        this.audio.pause();
    }

    getPercent(): number {
        return this.audio.currentTime / this.audio.duration * 100;
    }

    getDuration(): number {
        // seconds
        return this.audio.duration;
    }

    getBuffered(): number {
        if (this.audio.buffered.length > 0) {
            return this.audio.buffered.end(this.audio.buffered.length - 1);
        } else {
            return 0;
        }
    }


    getSeekableTimeRanges():TimeRanges {
        return this.audio.seekable;
    }


    public getMimeType(): string {
        let mimetype:string = "";
        if (this.audio.canPlayType("audio/ogg") == "probably" ||
            this.audio.canPlayType("audio/ogg") == "maybe") {
            mimetype = "ogg";
        } else if (this.audio.canPlayType("audio/wav") == "probably" ||
            this.audio.canPlayType("audio/wav") == "maybe") {
            mimetype = "wav";
        } else if (this.audio.canPlayType("audio/mp3") == "probably" ||
            this.audio.canPlayType("audio/mp3") == "maybe") {
            mimetype = "mp3";
        }
        return mimetype;
    }
}


class BeanSoundPlayerControls {

    protected beanSound: BeanSound;
    protected options;

    constructor(beanSound) {

        if (beanSound) {
            this.setSound(beanSound);
        }
    }


    setSound(beanSound): BeanSound {
        this.beanSound = beanSound;
        return this.beanSound.setup();
    }

    canPlayResource() : boolean {
        return this.beanSound !== null && this.beanSound.canPlayResource();
    }

    play(): void {
        this.beanSound.play();
    }

    stop(): void {
        this.beanSound.stop();
    }

    pause(): void {
        this.beanSound.pause();
    }
}



class BeanPlayer extends BeanSoundPlayerControls {
    getList() {
        return this._list;
    }

    setList(value) : BeanPlayer {
        this._list = value;
        return this;
    }

    getStopSelector() : string {
        return this._stopSelector;
    }

    setStopSelector(value: string) : BeanPlayer {
        this._stopSelector = value;
        return this;
    }


    getPlaySelector() : string {
        return this._playSelector;
    }

    setPlaySelector(value: string) : BeanPlayer {
        this._playSelector = value;
        return this;
    }

    getProgressSelector() : string {
        return this._progressSelector;
    }

    setProgressSelector(value: string) : BeanPlayer {
        this._progressSelector = value;
        return this;
    }

    setBufferedProgressSelector(value: string) : BeanPlayer {
        this._bufferedProgressSelector = value;
        return this;
    }

    getToggleClickSelector() : string {
        return this._toggleClickSelector;
    }

    setToggleClickSelector(value: string) : BeanPlayer {
        this._toggleClickSelector = value;
        return this;
    }

    setSliderSelector(value: string) : BeanPlayer {
        this._sliderSelector = value;
        return this;
    }


    setToggleTextSelector(value: string) : BeanPlayer {
        this._toggleTextSelector = value;
        return this;
    }

    private _progressSelector: string = "";
    private _bufferedProgressSelector: string = "";

    private _list;

    protected progessElem;
    protected bufferedProgessElem;

    private _toggleTextPlay: string = "&#9658;";
    private _toggleTextPause: string = "&#9646;";
    private _toggleTextSelector: string = ""; // idTextToggle
    private _toggleClickSelector: string = ""; // idToggle
    private _toggleButtonSelector: string = "";// idButtonToggle
    private _stopSelector: string = "";// idStop
    private _playSelector: string = "";// idPlay
    private _sliderSelector: string = "";
    private _imgSelector: string = "";
    private _imgSrc:string = "";

    constructor(beanSound) {
        super(beanSound);
    }

    public setup() {
        this.registerEvents();
    }

    private updateProgress() {
        let value = this.beanSound.getPercent();
        return this.progessElem.style.width = value + "%";
    }

    private updateSlider() {
        // only initital required
        e(this._sliderSelector).setAttribute("max", parseInt(this.beanSound.audio.duration * 10));
        e(this._sliderSelector).value = parseInt(this.beanSound.audio.currentTime * 10);
    }


    private registerEvents() {

        this.beanSound.audio.addEventListener('error', () => {
            console && console.log && console.log('error loading audio:' + this.beanSound.getSource());
        }, false);

        this.beanSound.audio.addEventListener("ended", () => {

            // return and play next if player is part of a list
            if (this._list != null) {
                this._list.next();
            }
            // onPlayerEnded -> ListNextEvent(this);
            // player ui
            if (this._toggleTextSelector !== "") {
                e(this._toggleTextSelector).innerHTML = this._toggleTextPlay;
            }

        }, false);


        if (this._sliderSelector !== "") {
            this.beanSound.audio.addEventListener("timeupdate", () => {
                this.updateSlider();
            }, false);

            e(this._sliderSelector).addEventListener("change", () => {
                // if (!this.beanSound.isSeekable()) return;
                this.beanSound.audio.currentTime =  e(this._sliderSelector).value / 10;
            }, false);

        }

        if (this._progressSelector !== "") {
            this.progessElem = e(this._progressSelector);
            this.beanSound.audio.addEventListener("timeupdate", () => {
                this.updateProgress();
            }, false);

            this.progessElem.addEventListener("click", (event) => {
                // if (!this.beanSound.isSeekable()) return;
                // console.log(this.progessElem.style.width);
                this.beanSound.audio.currentTime = parseInt(event.clientX);
                this.updateProgress();
            }, false);


        }

        if (this._bufferedProgressSelector !== "") {
            this.bufferedProgessElem = e(this._bufferedProgressSelector);
            this.beanSound.audio.addEventListener('progress', () => {
                let bufferedEnd = this.beanSound.getBuffered();
                let duration = this.beanSound.getDuration();
                if (duration > 0) {
                    this.bufferedProgessElem.style.width = ((bufferedEnd / duration)*100) + "%";
                }
            });
        }

        if (this._toggleClickSelector !== "") {
            e(this._toggleClickSelector).addEventListener("click", () => {
                if (this.beanSound.isPlaying()) {
                    this.pause();
                    if (this._toggleTextSelector !== "") {
                        e(this._toggleTextSelector).innerHTML = this._toggleTextPlay;
                    }
                } else {
                    this.play();
                    if (this._toggleTextSelector !== "") {
                        e(this._toggleTextSelector).innerHTML = this._toggleTextPause;
                    }
                }
            }, false);
        }

        if (this._stopSelector !== "") {
            e(this._stopSelector).addEventListener("click", () => {
                this.stop();
            }, false);
        }
        if (this._playSelector !== "") {
            e(this._playSelector).addEventListener("click", () => {
                this.onPlay();
                this.play();
            }, false);
        }
    }

    onPlay():void {
        if (this._imgSelector !== "" && this._imgSrc !== "" ) {
            e(this._imgSelector).src = this._imgSrc;
        }
    }
}

class BeanListPlayer {
    getToggleTextSelector(): string {
        return this._toggleTextSelector;
    }

    setToggleTextSelector(value: string): BeanListPlayer {
        this._toggleTextSelector = value;
        return this;
    }

    getToggleClickSelector(): string {
        return this._toggleClickSelector;
    }

    setToggleClickSelector(value: string): BeanListPlayer {
        this._toggleClickSelector = value;
        return this;
    }

    getToggleButtonSelector(): string {
        return this._toggleButtonSelector;
    }

    setToggleButtonSelector(value: string): BeanListPlayer {
        this._toggleButtonSelector = value;
        return this;
    }

    getNextButtonSelector(): string {
        return this._nextButtonSelector;
    }

    setNextButtonSelector(value: string): BeanListPlayer {
        this._nextButtonSelector = value;
        return this;
    }

    getPrevButtonSelector(): string {
        return this._prevButtonSelector;
    }

    setPrevButtonSelector(value: string): BeanListPlayer {
        this._prevButtonSelector = value;
        return this;
    }

    public static readonly LOOP_NONE = 0;
    public static readonly LOOP_LIST = 1;
    public static readonly LOOP_TRACK = 2;

    public sounds = [];

    protected highlightClass: string = "track-highlight";
    protected highlightIndex: number = 0;
    private curIndex = 0;
    private _loopmode = 0;

    private _toggleTextPlay: string = "&#9658;";
    private _toggleTextPause: string = "&#9646;";
    private _toggleTextSelector: string = ""; // idTextToggle
    private _toggleClickSelector: string = ""; // idToggle
    private _toggleButtonSelector: string = "";// idButtonToggle
    private _nextButtonSelector: string = "";// idNext
    private _prevButtonSelector: string = "";// idPrev


    constructor(playlist) {
        if (typeof playlist === "string") {
            this.setSoundsByName(playlist);
        }
    }

    public setSoundsByName(playlist): BeanListPlayer {
        let collection = document.getElementsByName(playlist);
        for (let playlistItem of collection) {
            let beanSoundId = playlistItem.id;
            if (!beanSoundId) {
                beanSoundId = playlist + "-" + this.curIndex++;
                playlistItem.setAttribute("id", beanSoundId);
                beanSoundId = "#" + beanSoundId;
            } else {
                beanSoundId = "#" + beanSoundId;
            }
            let beanplayer = new BeanPlayer(new BeanSound(playlistItem.getAttribute("data-sound")));

            beanplayer.setToggleClickSelector(beanSoundId)
                .setList(this)
                .setup();

            this.addSound(beanplayer);
        }
        this.curIndex = 0;
        return this;
    }

    public setup():void {
        this.registerEvents();
    }

    private registerEvents(): void {
        if (this._toggleClickSelector !== "") {
            e(this._toggleClickSelector).addEventListener("click", () => {
                if (this.sounds[this.curIndex].beanSound.isPlaying()) {
                    this.pause();
                    if (this._toggleTextSelector !== "") {
                        e(this._toggleTextSelector).innerHTML = this._toggleTextPlay;
                    }
                } else {
                    this.play();

                    if (this._toggleTextSelector !== "") {
                        e(this._toggleTextSelector).innerHTML = this._toggleTextPause;
                    }
                }
            }, false);
        }
        if (this._nextButtonSelector !== "") {
            e(this._nextButtonSelector).addEventListener("click", () => {
                this.next();
            }, false);
        }
        if (this._prevButtonSelector !== "") {
            e(this._prevButtonSelector).addEventListener("click", () => {
                this.prev();
            }, false);
        }
    }

    addSound(beanSound): number {
        if (beanSound.canPlayResource()) {
            return this.sounds.push(beanSound);
        }
        return 0;
    }

    play(): void {
        this.removeHighlightItem();
        this.highlightItem();
        this.sounds[this.curIndex].play();
    }

    pause(): void {
        this.sounds[this.curIndex].pause();
    }

    next(): void {
        // if (this.curIndex + 1 < this.sounds.length) {
        if (typeof this.sounds[this.curIndex+1] !== 'undefined') {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex++;
            this.sounds[this.curIndex].play();
            this.highlightItem();
        } else {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex = 0;

            if (this._loopmode === BeanListPlayer.LOOP_NONE) {
                if (this._toggleTextSelector !== "") {
                    e(this._toggleTextSelector).innerHTML = this._toggleTextPlay;
                }
            }

        }
    }

    prev(): void {
        if (this.curIndex - 1 >= 0) {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex--;
            this.sounds[this.curIndex].play();
            this.highlightItem();
        } else {
            this.sounds[this.curIndex].stop();
            this.removeHighlightItem();
            this.curIndex = this.sounds.length - 1;
            this.sounds[this.curIndex].play();
            this.highlightItem();
        }
    }

    byIndex(index): number {
        this.curIndex = index;
        return this.sounds[this.curIndex];
    }

    highlightItem(): void {
        let selector = this.sounds[this.curIndex].getToggleClickSelector();
        if (selector !== "" && e(selector)) {
            e(selector).classList.add(this.highlightClass);
            this.highlightIndex = this.curIndex;
        }
    }

    removeHighlightItem():void {
        let selector = this.sounds[this.highlightIndex].getToggleClickSelector();
        if (selector !== "" && e(selector)) {
            let elem = e(selector);
            if (elem) elem.classList.remove(this.highlightClass);
        }
    }
}




var e = selectors => document.querySelector(selectors);

let root = typeof exports !== 'undefined' && exports !== null ? exports : this;
root.BeanSound = BeanSound;
root.BeanPlayer = BeanPlayer;
root.BeanListPlayer = BeanListPlayer;
