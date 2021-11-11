class AudioController                                                                   //audio controller
{
    constructor()                                                                       //constructor called once an instent of the object is created it let audioController = new AudioController();
    {
        this.bgMusic = new Audio('./images/theme4.mp3') ;                               //"this" means that the variable belongs to that particular object. bgMusic it background music.
        this.flipSound = new Audio('./images/tardis.mp3');
        this.matchSound = new Audio('./images/fantastic2.mp3');
        this.victorySound = new Audio('./images/beautiful.mp3')
        this.gameOverSound = new Audio('./images/sorry.mp3')
        this.bgMusic.volume = .0;                                                       //this changes the volume whre 0 is mute and 1 is the loudest, if want to loop add this.bgMusic.loop=true;
        this.flipSound.volume = .0;
        this.matchSound.volume = .0;
        this.bgMusic.loop = true;                                                       // if false will stop the loop if true it will loop
    }
    startMusic()                                                                        //.play says if have funciton will call the statement below to play the music
    {
        this.bgMusic.play();
    }
        stopMusic()                                                                     //stopMusic will stop the music but there is not stop funciton with the audio object in JS so will need to pause it
        {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;                                                   //so pause then put the time back to 0 so will restart with play again.
    }
    flip() 
    {
        this.flipSound.play();
    }
    match() 
    {
        this.matchSound.play();
    }
    victory() 
    {
        this.stopMusic();                                                               //if decide to play bgMusic in a loop this will stop it to play the victory sound, same for the gameOver
       // this.victorySound.play();                                                     //this will control the victorySound if want to play something.
    }
    gameOver() 
    {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch
{
    constructor(totalTime, cards)                                                       //there are properties of this object that are set from the constructor cardsArray and totalTime; the rest are dynamicaly 
    {
        this.cardsArray = cards;                                                        //when start the game none of the cards are flipped, when click one it flips this is the card to check when you flip the next card it will check it matches the first. if not they will flip over
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;                                                 //countdown timer, which is the time remaining anytime within the game
        this.timer = document.getElementById('time-remaining');                         //the actual timer itself and needs to be pulled from the DOM
        this.ticker = document.getElementById('flips');                                 //everytime flip a card the flips will be counted
        this.audioController = new AudioController();                                   //this audioController belongs to MixOrMatch
    }

    startGame()                                                                         //startGame is a function
    {
        this.cardToCheck = null;                                                        //this will get called more often the the above constructor will be called everytime the game is over or there is a victory and the player wants to play again
        this.totalClicks = 0;                                                           //total clicks will start over at 0 every time a new game is started
        this.timeRemaining = this.totalTime;                                            //time will restart everytime a new game is started
        this.matchedCards = [];                                                         //this has an array put all matched cards while we play a game into that array using this to check with the total cards array to see if there is a victory or not
        this.busy = true;                                                               
        setTimeout(() =>                                                                //takes a function in the first parameter and second parameter milliseconds this time out is so when start the game it makes it smoother with the little bit of a delay
        {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown(); 
            this.busy = false; 
        }, 500);                                                                        //wait 500 milliseconds before doing the rest of the funciton just above
        this.hideCards();
        this.timer.innerText = this.timeRemaining;                                      //restart the timer and below the ticker once a new game is started
        this.ticker.innerText = this.totalClicks;
    }

    hideCards()                                                                         //this is the hideCards function, loop through the cards array
    {
        this.cardsArray.forEach(card =>
            {
               card.classList.remove('visible');
               card.classList.remove('matched');
            });
    }   

    flipCard(card)
    {
        if(this.canFlipCard(card))                                                      //check if the user can flip a card or not then pass card
        {
            this.audioController.flip();
            this.totalClicks++;                                                         //iterating the total clicks and we are allowed to flip then the total clicks number will be ticke up one
            this.ticker.innerText = this.totalClicks;                                    //so the number on the screen will show the acutal number of clicks
            card.classList.add('visible');                                              //flip the card creates a class callded visible give it the visible class this is an animation flips 180degrees around 

            if(this.cardToCheck)                                                        //should we check for a match or flip for the first time if this is not null we want to check for a match.
                this.checkForCardMatch(card);
            else  
                this.cardToCheck= card;        
        }
    }

    checkForCardMatch(card)
    {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))               //if the card we just clicked is equal to the source attribut it will be matched. else it's a mismatch
            this.cardMatch(card, this.cardToCheck);
        else    
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;   
    }

    cardMatch(card1, card2)     
    {
        this.matchedCards.push(card1);                                                  //when match push both cards to the match array this will take two cards
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)                         //if the length of the marchedCards array is equal to the amount of cards we have then we know that all the cards in the cards array are also in the matchedCards array and we have matched all the cards and we have a victory
            this.victory();
    }

    cardMisMatch(card1, card2)                                                          //if the cards are misMatched you want them to flip over again, but you want to give the user a second to register what the cards are they see
    {
       this.busy = true;
       setTimeout(() => 
       {
           card1.classList.remove('visible');
           card2.classList.remove('visible');
           this.busy = false;
       }, 1000) ;
    }

    getCardType(card)                                                                   //this will return a string going to be the type of card this we will get from the source image on the front of the card
    {
        return card.getElementsByClassName('card-value')[0].src;                        //grabbing the card-value class from the card on the html page, and grabbing the source attribute (.src) this is the face card with the images we want matched
    }

    startCountDown()
    {
        return setInterval(() =>                                                        //create a count down, interval if you give the time 1000 milliseconds this will call it every 1000 ms
        {
            this.timeRemaining--;                                                       //for -- take the time remaining and minus 1
            this.timer.innerText = this.timeRemaining;                                  //update the timeRemaining itself on the html page
            if(this.timeRemaining === 0)                                                //if the timeRemaining is equal to 0 then time over, this is how we will check if the game is over. if it reaches 0 the game is over
                this.gameOver();
        }, 1000);       
    }

    gameOver()                                                                          //gameOver function, 
    {
        clearInterval(this.countDown);                                                  //we will clear the countDown and restart it everytime the user starts the game
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');             //visible so it clears the countDown plays the game over sound and the game over screen pops up
    }

    victory()
    {
        clearInterval(this.countDown);                                                  //will stop the countdown if there is a victory
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
        // this.hideCards();                                                           //this will flip the cards over to the back. I like looking at the images.
    }

    shuffleCards()                                                                      //want the cards to be shuffled. this is a static function that takes no arguement
    {
        for(let i = this.cardsArray.length - 1; i > 0; i--)                             //for loop take the Fisher and Yates shuffle algorithm
        {
            let randIndex = Math.floor(Math.random() * (i+1));                          //math.floor will round down, math.random creates a random float between 0 and 1 but not 1 itself, then take i add 1 then we will round down
            this.cardsArray[randIndex].style.order = i;                                 //we are using the css grid; which has a property called order, we are not shuffling the array its self but shuffle the order of the cards the way they are being displayed; .style because its CSS .order because it's the property that we are using. setting to i because its a number
            this.cardsArray[i].style.order = randIndex;                                 //taking the random item in the cards list and taking the card that we are in and swapping the grid order
        }
    }

    canFlipCard(card)                                                                   //checks if user is allowed to flip the cards there are 3 scenario where they are not allowed to flip a card: the 1st is if this.busy = true which is when an animation is happening not allowed to click until this is done, 2nd not allowed to click on a card if its matched, and 3rd if you flip the 1st card this is the card to flip and you don't want the user to click it again until they click the 2nd card to check
    {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)        //this is what is stated above in notes where !== this does not equal; all of this creates a bullean if all of that is right then it equals false if any part of those statements are true
    }
}

function ready()
{
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));         //document.getElementsByClassName('overlay-text') this return an HTML collection which is not an array, which doesn't have accesss to the javascript array function so use array.from the create an array from the html collections
    let cards = Array.from(document.getElementsByClassName('card')); 
    let game = new MixOrMatch(100, cards )                                              //100 seconds

    overlays.forEach(overlay =>                                                         //loop over all of them and add a click event to them, array function acalled forEach it takes a funciton that you want to get called for everyitem in the array. so do what is between the {}
    {
        overlay.addEventListener('click', () =>                                         //for each overlay we add an event listener on the click and will do what's between these {}
        {
            overlay.classList.remove('visible');                                        //visible is the class given so that it's visible to the person playing the game. the start overlay. 
            game.startGame();
            let audioController = new AudioController();
            audioController.startMusic();
        });
    });
    cards.forEach(card => 
    {
        card.addEventListener('click', () =>
        {
            game.flipCard(card);
        });
    });
}


if(document.readyState ==='loading')                                                    //readyState is state of the loading process
{
    document.addEventListener('DOMContentLoaded', ready());                             //once everything inside the html file has loaded it will call what everfunction we give it which is ready.
} else {
    ready();
}


