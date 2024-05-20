class BoggleGame{
    /* new game with this dom id*/

    constructor(boardId, secs = 60){
        this.secs = secs; // length of a game
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);

        this.timer = setInterval(this.tick.bind(this), 1000);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    // words in order list

    showWord(word){
        $(".word", this.board).append($("<li>", { text: word}));
    }

    showScore(){
        $(".score", this.board).text(this.score);
    }

    // status message

    showMessage(msg, cls){
        $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }
    // submission of words if valid count and show score

    async handleSubmit(evt){
        evt.preventDefault();
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word) return;

        if (this.words.has(word)) {
            this.showMessage(`Already found ${word}`, "err");
            return;

        }

        // check server
        const resp = await axios.get("/check-word", {params: {word: word }});
        if (resp.data.result === "not-word") {
            this.showMessage(`${word} not valid`, err);

        } else if ( resp.data.result === "not-on-board"){
            this.showMessage(`${word} not valid for board`, "err");

        } else{
            this.showWord(word);
            this.score += word.lenght;
            this.showScore();
            this.words.add(word);
            this.showMessage(`Added: ${word}` , "ok");
        }

        $word.val("").focus();
    }

    // Update timer

    showTimer(){
        $(".timer", this.board).text(this.secs);
    }

    // Handles the ticker

    async tick(){
        this.secs -= 1;
        this.showTimer();
        if (this.secs === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    // end of game, thanks message 

    async scoreGame(){
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score});
        if (resp.data.brokeRecord){
            this.showMessage(`Record ${this.score}`, "ok");
        } else {
            this.showMessage(`Score ${this.score}`, "ok" );
        }
    }
}