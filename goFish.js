class goFishDeck{
    constructor(){
        this.deck = [];
    }
    //create and shuffle a deck made of a queue
    deckMaker(){
        let deck = []
        for (let x = 0; x < 10; x++){
            deck.push(x + 'H');
            deck.push(x + 'C');
            deck.push(x + 'S');
            deck.push(x + 'D');
        }
        deck.push('KH');
        deck.push('KC');
        deck.push('KS');
        deck.push('KD');
        deck.push('JH');
        deck.push('JC');
        deck.push('JS');
        deck.push('JD');
        deck.push('QH');
        deck.push('QC');
        deck.push('QS');
        deck.push('QD');


        //fisher-yates shuffler
        //https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
        // fyShuffle(){
        //     //take the deck and shuffle it
        //     for(let i = this.deck.length - 1; i > 0; i--){
        //         const j = Math.floor(Math.random() * i)
        //         const temp = this.deck[i]
        //         this.deck[i] = this.deck[j]
        //         this.deck[j] = temp
        //       }
        // }

        // shuffle deck
        for(let i = deck.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = deck[i]
            deck[i] = deck[j]
            deck[j] = temp
          }
        this.deck = deck;
    }
    //how many cards are in the deck?
    get length(){
        return this.deck.length;
    }
    //draw a card
    draw(){
        //pop the top card of the deck
        return this.deck.shift();
    }
}
class goFishHand{
    constructor(){
        this.hand=[];
    }
    //add a card thats been drawn to your hand UNTESTED
    addToHand(x){
        this.hand.push(x);
    }
    //check if a hand has a card of a number Untested
    doesHandHaveCard(x){
        for (let y = 0; y < this.hand.length; y++){
            if (this.hand[y][0] == x){
                return y;
            }
        }
        return -1;
    }
    //how many cards in hand
    get length(){
        return this.hand.length;
    }
    printHand(){
        let strI = "";
        for (let r = 0; r < this.hand.length; r++){
            strI += "Card " + r + " is " + this.hand[r] + " \n";
        }
        return strI;
    }
    removeAtIndex(x){
        this.hand.splice(x,1);
    }
    returnListOfCards(){
        return this.hand;
    }
}
class theGame{
    constructor(){
        this.deck = new goFishDeck();
        this.p1 = new goFishHand();
        this.p2 = new goFishHand();
        // this.victory = -1;
        this.turn = -1;
        this.p1Score = 0;
        this.p2Score = 0;
        this.playerName = "";
        this.actualPlayer = "";
        this.AiPlayer = "";
        this.difficulty = -1;
        // 0: ai does not remember what you asked for
        // 1: ai will remember what you asked for
        this.watchlist = new Set();
        this.selectedCard = "";
    }
    ///Writers
    writeToInfoBox(x){
        document.getElementById("infoBox").innerText = x;
    }
    writeToToolTips(x){
        document.getElementById("toolTips").innerText = x;
    }
    /////////////Set-Up FUnctions
    //used at the beginning of the game to remove pairs
    eliminatePairs(){
    //use a while loop to eliminate pairs
    //check player 1's hand
    console.log("Eliminating Pairs...");
    let p1C = 0;
    let newText = "";
    while (p1C < this.p1.length){
        let reset = false;
        for (let pos = 1; p1C + pos < this.p1.length; pos++){
            //unshift later and current and set reset
            if (this.p1.hand[p1C][0] == this.p1.hand[p1C + pos][0]){
                // console.log("Match " + p1C + " to " + (p1C + pos));
                // console.log(this.p1.hand[p1C] + " " + this.p1.hand[p1C + pos])
                //unshift latest then earliest
                let code = this.p1.hand[p1C][0];
                this.p1.removeAtIndex(p1C+pos);
                this.p1.removeAtIndex(p1C);
                this.p1Score++;
                reset = true
                if (this.actualPlayer == "p1"){
                    newText += "You had a matching pair of ";
                    if (code == 0){
                        code = 10;
                    }
                    newText += code + "'s, so you got one point, bringing you to a total of " + this.p1Score + " points.<br>"
                }
                else{ //this.actualPlayer == "p2"
                    newText += "The AI had a matching pair of ";
                    if (code == 0){
                        code = 10;
                    }
                    newText += code + "'s, so the AI got one point, bringing it to a total of " + this.p1Score + " points.<br>"
                }
                break;
            }
        }
        if (!reset){
            p1C++;
        }
    }
    //check player 2's hand
    let p2C = 0;
    while (p2C < this.p2.length){
        let reset = false;
        for (let pos = 1;p2C + pos < this.p2.length; pos++){
            if (this.p2.hand[p2C][0] == this.p2.hand[p2C + pos][0]){
                // console.log("Match " + p2C + " to " + (p2C + pos));
                // console.log(this.p2.hand[p2C] + " " + this.p2.hand[p2C + pos])
                //unshift latest then earliest
                let code = this.p2.hand[p2C][0];
                this.p2.removeAtIndex(p2C+pos);
                this.p2.removeAtIndex(p2C);
                //
                this.p2Score++;
                reset = true
                if (this.actualPlayer == "p2"){
                    newText += "You had a matching pair of ";
                    if (code == 0){
                        code = 10;
                    }
                    newText += code + "'s, so you got one point, bringing you to a total of " + this.p2Score + " points.<br>"
                }
                else{ //this.actualPlayer == "p1"
                    newText += "The AI had a matching pair of ";
                    if (code == 0){
                        code = 10;
                    }
                    newText += code + "'s, so the AI got one point, bringing it to a total of " + this.p2Score + " points.<br>"
                }
                break;
            }
        }
        if (!reset){
            p2C++;
        }
    }
    return newText;
    }
    ///Game Begins
    gameStartUp(){
        ///ask for name
        let text = "";
        text +=         "What is your name?<br>";
        if (this.playerName == ""){
            text += "<input id='alias'><br>";
        }
        else{
            text += "<input id='alias' placeholder='Human Player' value='" + this.playerName + "'><br>";
        }
        text +="<button onclick='window.game.namePrompted()'>Submit Name</button>";
        document.getElementById("infoBox").innerHTML = "Set-Up"
        document.getElementById("actionBar").innerHTML = text;
    }
    ///function prompts user for the AI skill level
    namePrompted(){
        //read from thje action bar
        this.playerName = document.getElementById('alias').value;
        if (this.playerName == ""){
            this.playerName = "Human Player";
        }
        //proc for difficulty
        let eText = "The AI will not factor in cards you have asked for in its decision-making.";
        let hText = "The AI will remember the cards you have asked for, and will factor that into its decision-making.";
        let ceText = "The Ai will not factor in cards you have asked for, and you can see its cards.";
        let chText = "The AI will remember the cards you have asked for, and you can see its cards."

        document.getElementById("actionBar").innerHTML = "Hello, " + this.playerName + "!<br>" +
        "What difficulty are you looking for?<br>" +
        "<form>" +
        "<input type='radio' id='Easy' name='diff' value='easy' onclick='window.game.writeToToolTips(\"" + eText + "\")'>" +
        "<label for='Easy'>Easy</label><br>" +
        "<input type='radio' id='Hard' name='diff' value='hard' onclick='window.game.writeToToolTips(\"" + hText + "\")'>" +
        "<label for='Hard'>Hard</label><br>" +
        "<input type='radio' id='CEasy' name='diff' value='easyC' onclick='window.game.writeToToolTips(\"" + ceText + "\")'>" +
        "<label for='CEasy'>Cheating-Easy</label><br>" +
        "<input type='radio' id='CHard' name='diff' value='hardC' onclick='window.game.writeToToolTips(\"" + chText + "\")'>" +
        "<label for='CHard'>Cheating-Hard</label><br>" +
        "</form>" +
        //move on to game format
        "<button onclick='window.game.promptForFormat()'>Confirm</button>";
    }
    //prompts for who the player will be - 1 or 2
    promptForFormat(){
        //if no selection made be angry
        let diffCheck = document.getElementsByName("diff");
        for (let c = 0; c < diffCheck.length; c++){
            if (diffCheck[c].checked){
                // console.log(c);
                this.difficulty = c;
                //  0 is ez, 1 is hard, 2 is ezCheat, 3 is hardCheat
            }
        }
        if (this.difficulty == -1){
            //do not continue
            document.getElementById("errorBox").innerText = "You have not selected a difficulty."
        }
        else{
            //clear errorBoxd
            document.getElementById("errorBox").innerText = "";
            document.getElementById("toolTips").innerText = "";
            //prompt for player 1 or 2
            document.getElementById('actionBar').innerHTML =
            "Who will take their turn first, the AI or you?<br>" +
            "<form>" +
            "<input type='radio' id='AI' name='ord' value='AI'>" +
            "<label for='AI'>The AI will go first.</label><br>" +
            "<input type='radio' id='pla' name='ord' value='pla'>" +
            "<label for='pla'>You will go first.</label><br>" +
            "</form>" +
            "<button onclick='window.game.ruleConfirmation()'>Confirm</button>";
        }
    }
    ruleConfirmation(){
        //confirm the settings are correct
        //if they didnt pick get mad
        let ordCheck = document.getElementsByName("ord");
        let y = -1;
        for (let c = 0; c < ordCheck.length; c++){
            if (ordCheck[c].checked){
                // console.log(c);
                y = c;
            }
        }
        // console.log(y);
        if (y != -1){
            if (y == 1){
                this.actualPlayer = "p1";
            }
            else{
                this.actualPlayer = "p2";
            }
        }
        else {
            //angery!!!
            document.getElementById("errorBox").innerText = "You have not selected who will go first."
            return;
        }

        //confirm and list settings, else restart.
        document.getElementById("errorBox").innerText = "";
        // document.getElementById("actionBar").innerText =
        let senText =
        "These are the settings you have chosen." +
        "Your chosen name is: " + this.playerName + ".<br>";
        if (this.difficulty == 0){
            senText += "Your chosen difficulty is: Easy.<br>";
        }
        else if(this.difficulty == 1){
            senText += "Your chosen difficulty is: Hard.<br>";
        }
        else if (this.difficulty == 2){
            senText += "Your chosen difficulty is: Cheater's Easy.<br>"
        }
        else{
            senText += "Your chosen difficulty is: Cheater's Hard.<br>"
        }
        if (this.actualPlayer == "p1"){
            // console.log("Player 1");
            senText += "The player that will go first is you."
        }
        else{
            // console.log("Player 2");
            senText += "The player that will go first is the AI."
        }
        senText +=
        //add a return button
        "<br>Would you like to change anything?<br>" +
        "<button onclick='window.game.gameStartUp()'>Restart</button><emsp><button onclick='window.game.theGameBegins()'>Start</button";
        //set action bar
        document.getElementById("actionBar").innerHTML = senText;
    }
    theGameBegins(){
        // console.log(this.actualPlayer);
        this.deck.deckMaker();
        for (let count = 0; count < 7; count++){
            this.p1.addToHand(this.deck.draw());
            this.p2.addToHand(this.deck.draw());
        }

        let newText = this.eliminatePairs();
        document.getElementById('infoBox').innerHTML = "Gameplay!";
        document.getElementById('actionBar').innerHTML = "";
        document.getElementById('actionBar').innerHTML = newText;
        // start a turn...
        if (this.actualPlayer == "p1"){
            if ((this.difficulty == 2 ) || (this.difficulty == 3)){
                this.displayAiHandCheat(this.p2.hand);
            }
            else{
                this.displayAiHand(this.p2.hand);
            }
            this.displayHand(this.p1.hand);
        }
        else if (this.actualPlayer == "p2"){
            //let the AI do things
            console.log("AI's turn...");
            if ((this.difficulty == 0)||(this.difficulty == 2)){
                //Easy
                console.log("EZ Turn...");
                this.promptForAiActionEasy("p1");
            }
            else{//this.difficulty == 1 // hard
                console.log("Hard Turn...")
                this.promptForAiActionHard("p1");
            }
        }

    }
    /////////////////////////////////////////////////////////
    ///Player Actions
    displayHand(cardList){
        //change style to reflect amount of cards
        //overlay images over each other proportional to width of screen and amount of cards
        //1/(amount of cards) to screen
        //dedicate like 80 percent width to cards
        console.log("Displaying hand...");
        let htmlToShow = "<h3>Your Hand</h3>";
        if (cardList.length == 0){
            if (this.actualPlayer == "p1"){
                this.p1.addToHand(this.deck.draw());
            }
            else{
                this.p2.addToHand(this.deck.draw());
            }
        }
        if (this.actualPlayer == "p1"){
            htmlToShow += this.p1Score + " pts<br>";
        }
        else{
            htmlToShow += this.p2Score + " pts<br>";
        }
        htmlToShow += "Click on a card to select it.<br>";
        let suit = "";
        let identity = "";
        //draw a card if empty
        for (let i = 0; i < cardList.length; i++){
            //suit dictation
            if (cardList[i][1] == "H"){
                suit = "Hearts";
            }
            else if (cardList[i][1] == "D"){
                suit = "Diamonds";
            }
            else if (cardList[i][1] == "S"){
                suit = "Spades";
            }
            else{
                suit = "Clubs";
            }
            //identity
            identity = cardList[i][0];
            if (identity == "0"){
                identity = "10";
            }
            else if (identity == "K"){
                identity = "King";
            }
            else if (identity == "J"){
                identity = "Jack";
            }
            else if (identity == "Q"){
                identity = "Queen";
            }
            //each card width should be 0.8vw * (100/CARDLIST.SIZE)
            // <img src=".png" alt="Smiley face" height="42" width="42"></img>
            htmlToShow += "<img onclick='window.game.designateCard(" + i + ",\"" + suit + "\",\"" + identity +
            "\")' src='Cards/" +
            cardList[i] +".png' alt='" +identity+ " of " + suit +
            "' width='" + (8 * 100/7)   + "vw'></img>";
        }
        document.getElementById("yourCards").innerHTML = htmlToShow;
    }
    designateCard(index,suit,identity){
        //write to tooltips - you selected a card and confrimation button
        //make the card selected
        // x should be an index, hand[x]
        this.selectedCard = index;
        //details on the selection
        let textToWrite = "You've selected the " + identity + " of " + suit + ".<br>";
        //add the confirmation button here
        textToWrite += "<button onclick='window.game.promptForActionFinish()'>Confirm</button>"
        document.getElementById("toolTips").innerHTML = textToWrite;
    }
    displayHandNoClick(cardList){
        let htmlToShow = "";
        let divide = cardList.length;
        let suit = "";
        let identity = "";
        for (let i = 0; i < divide; i++){
            //suit dictation
            if (cardList[i][1] == "H"){
                suit = "Hearts";
            }
            else if (cardList[i][1] == "D"){
                suit = "Diamonds";
            }
            else if (cardList[i][1] == "S"){
                suit = "Spades";
            }
            else{
                suit = "Clubs";
            }
            //identity
            identity = cardList[i][0];
            if (identity == "0"){
                identity = "10";
            }
            else if (identity == "K"){
                identity = "King";
            }
            else if (identity == "J"){
                identity = "Jack";
            }
            else if (identity == "Q"){
                identity = "Queen";
            }
            //

            //each card width should be 0.8vw * (100/CARDLIST.SIZE)
            // <img src=".png" alt="Smiley face" height="42" width="42"></img>
            htmlToShow += "<img src='Cards/" +
            cardList[i] +".png' alt='" +identity+ " of " + suit +
            "' width='" + (8 * 100/cardList.length)   + "vw'></img>";
        }
        document.getElementById("yourCards").innerHTML = htmlToShow;
    }
    displayAiHandCheat(cardList){
        let htmlToShow = "<h3>The AI's hand</h3>";
        let divide = cardList.length;
        let suit = "";
        let identity = "";
        if (this.actualPlayer == "p1"){
            htmlToShow += this.p2Score + " pts<br>";
        }
        else{
            htmlToShow += this.p1Score + " pts<br>";
        }
        for (let i = 0; i < divide; i++){
            //suit dictation
            if (cardList[i][1] == "H"){
                suit = "Hearts";
            }
            else if (cardList[i][1] == "D"){
                suit = "Diamonds";
            }
            else if (cardList[i][1] == "S"){
                suit = "Spades";
            }
            else{
                suit = "Clubs";
            }
            //identity
            identity = cardList[i][0];
            if (identity == "0"){
                identity = "10";
            }
            else if (identity == "K"){
                identity = "King";
            }
            else if (identity == "J"){
                identity = "Jack";
            }
            else if (identity == "Q"){
                identity = "Queen";
            }
            //

            //each card width should be 0.8vw * (100/CARDLIST.SIZE)
            // <img src=".png" alt="Smiley face" height="42" width="42"></img>
            htmlToShow += "<img src='Cards/" +
            cardList[i] +".png' alt='" +identity+ " of " + suit +
            "' width='" + (8 * 100/7)   + "vw'></img>";
        }
        document.getElementById("enemyLocation").innerHTML = htmlToShow;
    }
    displayAiHand(cardList){
        // console.log(this.p2.hand);
        let htmlToShow = "<h3>The AI's hand</h3>";
        if (this.actualPlayer == "p1"){
            htmlToShow += this.p2Score + " pts<br>";
        }
        else{
            htmlToShow += this.p1Score + " pts<br>";
        }
        for (let i = 0; i < cardList.length; i++){
            htmlToShow += "<img src='Cards/atlasBack.png' alt='Card Back' width='" + (8 * 100/7) + "vw'></img>";
        }
        document.getElementById("enemyLocation").innerHTML = htmlToShow;
    }
    promptForActionFinish(){
        //check if opponet has selected card and set selected to default
        //display without clicking ability
        //check for victory and turn over to AI if not victory
        ///clear the actionBar
        document.getElementById("toolTips").innerHTML = "";
        document.getElementById("actionBar").innerHTML = "";
        //what is the card?
        let cardToSteal = "";
        if (this.actualPlayer == "p1"){
            // console.log(this.p1.hand[this.selectedCard]);
            cardToSteal = this.p1.hand[this.selectedCard][0];
            document.getElementById("actionBar").innerHTML = "You selected " + this.p1.hand[this.selectedCard][0] + ".<br>";
            this.watchlist.add(cardToSteal);
            //identified card to search for, check opp hand for it
            let location = this.p2.doesHandHaveCard(cardToSteal);
            if (location != -1){
                //card was found
                //console.log("Card was found at " + location);
                document.getElementById("actionBar").innerHTML = "The AI had the card.<br>"
                this.p2.removeAtIndex(location);
                this.p1.removeAtIndex(this.selectedCard);
                this.watchlist.delete(cardToSteal);
                this.p1Score++;
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "Your score is now " + this.p1Score + ".<br>";
                //check for victory
                if (this.checkVictory()){
                    this.victoryText();
                }
                //do it again
                else{
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "Since you matched, you get another turn.<br>";
                    if (this.difficulty === 2 || this.difficulty === 3){
                        this.displayAiHandCheat(this.p2.hand);
                    }else{
                        this.displayAiHand(this.p2.hand);
                    }
                    this.displayHand(this.p1.hand);
                }
            }
            else{
                //card was not found, so go fish.
                document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "You are told to GO FISH!<br>"
                let newCard = this.deck.draw();
                //search cards
                let checkMe = this.p1.doesHandHaveCard(newCard[0]);
                if (checkMe != -1){
                    // a card was found
                    let t = newCard[0];
                    if (t == 0){
                        t = 10;
                    }
                    document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "You drew into a pair of " + t + "'s.<br>";
                    this.p1.removeAtIndex(checkMe);
                    this.watchlist.delete(newCard[0]);
                    this.p1Score++;
                    document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "Your score is now " + this.p1Score + ".<br>";
                    if (newCard[0] == cardToSteal){
                        // get another turn
                        //check victory
                        if (this.checkVictory()){
                            this.victoryText();
                            return;
                        }
                        document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "Since you got the card you asked for, you get another turn.<br>";
                        // console.log(this.p2.hand);
                        // console.log(this.p1.hand);
                        if (this.difficulty === 2 || this.difficulty === 3){
                          this.displayAiHandCheat(this.p2.hand);
                        }else{
                          this.displayAiHand(this.p2.hand);
                        }
                        this.displayHand(this.p1.hand);
                    }
                    else{                     ///do not get another turn
                        document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "Since the card you drew was not the one you asked for, you do not get another turn.<br>";
                        if ((this.difficulty == 0)||(this.difficulty == 2)){
                            this.promptForAiActionEasy("p2");
                        }
                        else{
                            this.promptForAiActionHard("p2");
                        }
                    }
                }
                else{ //a card was not found
                    //pass back to AI
                    let t = newCard[0];
                    if (t == 0){
                        t = 10;
                    }
                    document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "You drew a " + t + ".<br>";
                    this.p1.addToHand(newCard);
                    if ((this.difficulty == 0)||(this.difficulty == 2)){
                        this.promptForAiActionEasy("p2");
                    }
                    else{
                        this.promptForAiActionHard("p2");
                    }
                }

            }
        }
        else{ //this.actualPlayer == "p2"
            cardToSteal = this.p2.hand[this.selectedCard][0];
            document.getElementById("actionBar").innerHTML = "You selected " + this.p2.hand[this.selectedCard][0] + ".<br>";
            this.watchlist.add(cardToSteal);
            let location = this.p1.doesHandHaveCard(cardToSteal);
            if (location != -1){
                document.getElementById("actionBar").innerHTML = "The AI had the card.<br>";
                this.p1.removeAtIndex(location);
                this.p2.removeAtIndex(this.selectedCard);
                this.watchlist.delete(cardToSteal);
                this.p2Score++;
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "Your score is now " + this.p2Score + ".<br>";
                if (this.checkVictory()){
                    this.victoryText();
                }
                else{
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "Since you matched, you get another turn.<br>";
                    if (this.difficulty === 2 || this.difficulty === 3){
                      this.displayAiHandCheat(this.p1.hand);
                    }else{
                      this.displayAiHand(this.p1.hand);
                    }
                    this.displayHand(this.p2.hand);
                }
            }
            else{
                document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "You are told to GO FISH!<br>";
                let newCard = this.deck.draw();
                let checkMe = this.p2.doesHandHaveCard(newCard[0]);
                if (checkMe != -1){
                    let t = newCard[0];
                    if (t == 0){
                        t = 10;
                    }
                    document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "You drew into a pair of " + t + "'s.<br>";
                    this.p2.removeAtIndex(checkMe);
                    this.watchlist.delete(newCard[0]);
                    this.p2Score++;
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "Your score is now " + this.p2Score + "<br>";
                    if (newCard[0] == cardToSteal){
                        if (this.checkVictory()){
                            this.victoryText();
                            return;
                        }
                        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "Since you got the card you asked for, you get another turn.<br>";
                        if (this.difficulty === 2 || this.difficulty === 3){
                          this.displayAiHandCheat(this.p2.hand);
                        }else{
                          this.displayAiHand(this.p2.hand);
                        }
                        this.displayHand(this.p1.hand);
                    }
                    else{
                        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "Since the card you drew was not the one youa sked for, you do not get another turn.<br>";
                        if ((this.difficulty == 0)|| (this.difficulty == 2)){
                            this.promptForAiActionEasy("p1");
                        }
                        else{
                            this.promptForAiActionHard("p1");
                        }
                    }
                }
                else{
                    let t = newCard[0];
                    if (t == 0){
                        t = 10;
                    }
                    document.getElementById("actionBar").innerHTML = document.getElementById('actionBar').innerHTML + "You drew a " + t + ".<br>";
                    this.p2.addToHand(newCard);
                    if ((this.difficulty == 0)||(this.difficulty == 2)){
                        this.promptForAiActionEasy("p1");
                    }
                    else{
                        this.promptForAiActionHard("p2");
                    }
                }
            }
        }
    }

    //////////AI METHODS
    promptForAiActionEasy(x){
        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI starting their turn.<br>";
        let streakbroken = false;
        while (!streakbroken){
            streakbroken = !this.selectCardFromHandEZ(x);
        }
        if (this.checkVictory()){
            this.victoryText();
        }
        else{ //no victoy
        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI is ending their turn.<br>";
            if (x == "p1"){
                if ((this.difficulty == 2 ) || (this.difficulty == 3)){
                    this.displayAiHandCheat(this.p1.hand);
                }
                else{
                    this.displayAiHand(this.p1.hand);
                }
                this.displayHand(this.p2.hand);
            }
            else{//x == p2
                this.displayHand(this.p1.hand);
                if (this.difficulty === 2 || this.difficulty === 3){
                  this.displayAiHandCheat(this.p2.hand);
                }else{
                  this.displayAiHand(this.p2.hand);
                }
            }
        }
    }
    selectCardFromHandEZ(x){
        if (x == "p1"){
            //IF NO CARDS IN HAND
            if (this.p1.hand.length == 0){
                //draw a card and call it
                if (this.deck.length == 0){
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML +  "AI's hand is empty, so they tried to draw a card, but the deck was empty.<br>";
                    //console.log("AI's hand is empty, so they tried to draw a card, but the deck was empty.")
                    return false;
                }
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML +  "AI's hand is empty, so they drew a card.<br>";
                //console.log("AI's hand is empty, so they drew a card.")
                this.p1.addToHand(this.deck.draw());
            }
            let rNum = Math.floor(Math.random() * Math.floor(this.p1.length));
            let cardSearch = this.p1.hand[rNum][0];
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            //console.log("The AI has chosen " + cardSearch);
            let c = cardSearch;
            if ( c == 0){
                c = "10";
            }
            document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI has chosen " + c + ".<br>";
            //check if p2 has that card
            let checkMe = this.p2.doesHandHaveCard(cardSearch);
            if (checkMe == -1){
                //didnt have it
                // console.log("You tell them to GO FISH.");
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "You tell them to GO FISH.<br>";
                let newCard = this.deck.draw();
                //if card drawn is a pair
                let checkMe = this.p1.doesHandHaveCard(newCard[0]);
                if (checkMe != -1){
                    //remove pair card from p1 hand and increment p1 score by 1
                    // console.log("The AI found a pair of " + newCard[0])
                    let t = newCard[0];
                    if (t == 0){
                        t = 10;
                    }
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI found a pair of " + t + ".<br>";
                    // this.p1.removeFromHand(checkMe); //UNTESTED
                    this.p1.removeAtIndex(checkMe);
                    this.p1Score++;
                    // console.log("The AI's score is now " + this.p1Score + ".");
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI's score is now " + this.p1Score + ".<br>";
                    // this.p1.removeFromHand(checkMe); //UNTESTED
                    if (newCard[0] == cardSearch){
                        ///the card picked up was the card being looked for, so additional turn
                        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI found the card they were looking for, so they go again.<br>";
                        return true;
                    }
                    //this was not the card they were looking for, so they do not get an additional turn
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The card the AI found was not the one they asked for, so they do not get another turn.";
                    return false;
                }
                else{
                    //console.log("Card was added to AI's hand.")
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "A card was added to the AI's hand.<br>";
                    this.p1.addToHand(newCard);
                    return false;
                }
            }
            else{
                //did have it
                //take card from player 2 and increment score, return true
                // console.log("You give your card to the AI.")
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "You give your card to the AI.<br>";
                this.p1.removeAtIndex(rNum);
                this.p2.removeAtIndex(checkMe); //UNTESTED
                this.p1Score++;
                // console.log("The AI's score is now " + this.p1Score + ".");
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI's score is now " + this.p1Score + ".<br>";

                return true;
            }

        }
        //
        else if (x == "p2"){
            //same thing but im player 1 now
            if (this.p2.hand.length == 0){
                //draw a card and call it
                if (this.deck.length == 0){
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML +  "AI's hand is empty, so they tried to draw a card, but the deck was empty.<br>";
                    //console.log("AI's hand is empty, so they tried to draw a card, but the deck was empty.")
                    return false;
                }
               // console.log("AI's hand is empty, so they drew a card.")
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML +  "AI's hand is empty, so they drew a card.<br>";
                this.p2.addToHand(this.deck.draw());
            }
            let rNum = Math.floor(Math.random() * Math.floor(this.p2.length));
            let cardSearch = this.p2.hand[rNum][0];
            let c = cardSearch;
            if ( c == 0){
                c = "10";
            }
            //console.log("The AI has chosen " + cardSearch);
            document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI has chosen " + c + ".<br>";
            let checkMe = this.p1.doesHandHaveCard(cardSearch);
            if (checkMe == -1){
                //didnt have it
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "You tell them to GO FISH.<br>";
                let newCard = this.deck.draw();
                //if card drawn is a pair
                let checkMe = this.p2.doesHandHaveCard(newCard[0]);
                if (checkMe != -1){
                    //remove pair card from p1 hand and increment p1 score by 1
                    let t = newCard[0];
                    if (t == 0){
                        t = 10;
                    }
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI found a pair of " + t + ".<br>";
                    this.p2.removeAtIndex(checkMe);
                    this.p2Score++;
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI's score is now " + this.p2Score + ".<br>";
                    if (newCard[0] == cardSearch){
                        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI found the card they were looking for, so they go again.<br>";
                        return true;
                    }
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The card the AI found was not the one they asked for, so they do not get another turn.";
                    return false;
                }
                else{
                    document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "A card was added to the AI's hand.<br>";
                    this.p2.addToHand(newCard);
                    return false;
                }
            }
            else{
                //did have it
                //take card from player 2 and increment score, return true
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "You give your card to the AI.<br>";
                this.p2.removeAtIndex(rNum);
                this.p1.removeAtIndex(checkMe);
                this.p2Score++;
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI's score is now " + this.p2Score + ".<br>";
                return true;
            }







        }
    }
    promptForAiActionHard(x){
        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI starting their turn.<br>";
        let streakbroken = false;
        while (!streakbroken){
            streakbroken = !this.selectCardFromHandHRD(x);
            if (this.checkVictory()){
                this.victoryText();
            }
        }
        if (this.checkVictory()){
            this.victoryText();
        }
        else{ //no victoy
        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + "The AI is ending their turn.<br>";
            if (x == "p1"){
              if (this.difficulty === 2 || this.difficulty === 3){
                this.displayAiHandCheat(this.p1.hand);
              }else{
                this.displayAiHand(this.p1.hand);
              }
                this.displayHand(this.p2.hand);
            }
            else{//x == p2
                this.displayHand(this.p1.hand);
                if (this.difficulty === 2 || this.difficulty === 3){
                  this.displayAiHandCheat(this.p2.hand);
                }else{
                  this.displayAiHand(this.p2.hand);
                }
            }
        }
    }
    selectCardFromHandHRD(x){
        if (x == "p1"){
            //check against watchlist
            let possible = [];
            for (let li = 0; li < this.watchlist.length; li++){
                if (this.p1.doesHandHaveCard(this.watchlist[li])){
                    possible.push(this.watchlist[li]);
                }
            }
            if (possible.length == 0){ //as if it were ez
                return this.selectCardFromHandEZ(x);
            }
            else{
                //pick a random card from the possible list
                let rNum = Math.floor(Math.random() * Math.floor(possible.length));
                rNum = possible[rNum];
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar") + "Based on previous asking behavior, the AI has chosen " + rNum + ".<br>";
                this.watchlist.delete(rNum);
                let ans = this.p2.doesHandHaveCard(rNum);
                this.p2.removeAtIndex(ans);
                this.p1.removeAtIndex(this.p1.doesHandHaveCard(rNum));
                this.p1Score++;
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar") + "You give the card to the AI. <br>The AI's score is now " + this.p1Score + ".<br>";
                return true;
            }
        }
        else if (x == "p2"){
            let possible = [];
            for (let li = 0; li < this.watchlist.length; li++){
                if (this.p2.doesHandHaveCard(this.watchlist[li])){
                    possible.push(this.watchlist[li]);
                }
            }
            if (possible.length == 0){
                return this.selectCardFromHandEZ(x);
            }
            else{
                let rNum = Math.floor(Math.random() * Math.floor(possible.length));
                rNum = possible[rNum];
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar") + "Based on previous asking behavior, the AI has chosen " + rNum + ".<br>";
                this.watchlist.delete(rNum);
                let ans = this.p1.doesHandHaveCard(rNum);
                this.p1.removeAtIndex(ans);
                this.p2.removeAtIndex(this.p2.doesHandHaveCard(rNum));
                this.p2Score++;
                document.getElementById("actionBar").innerHTML = document.getElementById("actionBar") + "You give the card to the AI. <br>The AI's score is now " + this.p2Score + ".<br>";
                return true;
            }
        }
    }
    /////////////////////////////




/////////////Enders
    checkVictory(){
        ///deck empty and hands be empty
        if (this.deck.length == 0 && this.p1.length == 0 && this.p2.length == 0){
            console.log("Someone has won!")
            return true;
        }
        return false;
    }
    victoryText(){
        document.getElementById("actionBar").innerHTML = "";
        this.displayHand(this.p1.hand);
        this.displayAiHandCheat(this.p2.hand);
        let textToWrite = "The game is over, as both deck and hand are empty. <br>";
        //look and see who has the most points, or tie.
        if (this.p2Score == this.p1Score){
            textToWrite += "The game has ended in a tie. " + this.p1Score + " - " + this.p2Score;
        }
        else if (this.p1Score > this.p2Score){
            if (this.actualPlayer == "p1"){
                textToWrite += "You won the game! " + this.p1Score + " - " + this.p2Score;
            }
            else{
                textToWrite += "You lost the game... " + this.p2Score + " - " + this.p1Score;
            }
        }
        else if (this.p2Score > this.p1Score){
            if (this.actualPlayer == "p2"){
                textToWrite += "You won the game! " + this.p2Score + "-" + this.p1Score;
            }
            else if (this.actualPlayer == "p1"){
                textToWrite += "You lost the game... " + this.p1Score + " - " + this.p2Score;
            }
        }
        // then ask the player if they want to restart
        document.getElementById("infoBox").innerHTML = "";
        document.getElementById("errorBox").innerHTML = "";
        document.getElementById("toolTips").innerHTML = "";
        document.getElementById("actionBar").innerHTML = document.getElementById("actionBar").innerHTML + textToWrite +
        "<br><button onclick='window.game.gameStartUp()'>Restart</button>";
        //restart game button
    }
}
////////////////////////////////////
function game(){
    window.game = new theGame();
    window.game.gameStartUp();
}
