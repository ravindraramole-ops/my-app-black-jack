import React from 'react';
import '../index.css';

//Renders card object
function Card(props){
    if(props.suit === "hearts"){
        return(
            <div className="hands">
                {props.notation} 
                <span>&hearts;</span>
            </div>
        );
    }
    if(props.suit === "spades"){
        return(
            <div className="hands">
                {props.notation} 
                <span>&spades;</span>
            </div>
        );
    }
    if(props.suit === "clubs"){
        return(
            <div className="hands">
                {props.notation} 
                <span>&clubs;</span>
            </div>
        );
    }
    if(props.suit === "diamonds"){
        return(
            <div className="hands">
                {props.notation} 
                <span>&diams;</span>
            </div>
        );
    }
    if(props.suit === "face-down"){
        return(
            <div className="hands">
                ####
            </div>
        );
    }
}

//Renders dealer and player hands
class Hand extends React.Component{
    renderHand(){
        const rows = [];
        for(let i=0; i<this.props.hand.length; i++) {
            //initial dace down card for dealer
            if(this.props.faceDownCard && i===1){
                rows.push(<Card key={this.props.hand[i].notation+this.props.hand[i].suit} notation={this.props.hand[i].notation} suit={'face-down'} />);
            }else{
                rows.push(<Card key={this.props.hand[i].notation+this.props.hand[i].suit} notation={this.props.hand[i].notation} suit={this.props.hand[i].suit} />);
            }
        }
        return rows;
    }

    render(){
        return(
            <div className="flex-center flex-row">{this.renderHand()}</div>
        );
    }
}

//React component game
class Game extends React.Component {
    constructor(props){
        super(props);
        this.cards = generateDeck(1);
        let playerHand = [], dealerHand = [];
        //Initializing the initial hands for player and dealer
        playerHand.push(getRandomCard(this.cards))
        playerHand.push(getRandomCard(this.cards))
        dealerHand.push(getRandomCard(this.cards))
        dealerHand.push(getRandomCard(this.cards))

        let playerHandVal = getHandValue(playerHand);
        let dealerHandVal = getHandValue(dealerHand);

        //if player hits 21 in the initial hand then BlackJack
        if(playerHandVal === 21){
            this.state = {
                playerHand: playerHand,
                dealerHand: dealerHand,
                gameStatus: {status:"BlackJack", playerMode: false},
                playerHandValue: playerHandVal,
                dealerHandValue: dealerHandVal
            }
        }else{
            this.state = {
                playerHand: playerHand,
                dealerHand: dealerHand,
                gameStatus: {status:"In Progress", playerMode: true},
                playerHandValue: playerHandVal,
                dealerHandValue: dealerHandVal
            }
        }
    }

    //functionality to handle game option hit
    onHit(){
        //if player already busted or standed then no action
        if(!this.state.gameStatus.playerMode){
            return;
        }
        let playerHandVal = getHandValue(this.state.playerHand);
        if(playerHandVal<=21){
            let playerHand = this.state.playerHand.slice(); //Maintaining immutibility of the state object by getting a copy of object and then modifying
            let newCard = getRandomCard(this.cards);
            playerHand.push(newCard);   //added new card to the player's hand
            playerHandVal = getHandValue(playerHand);
            //update the state according to the player's hand value
            if(playerHandVal > 21){
                this.setState({playerHand: playerHand, gameStatus: {status: "Busted", playerMode:false}, playerHandValue: playerHandVal});
            } else{
                this.setState({playerHand: playerHand, playerHandValue: playerHandVal});
            }
        }
    }

    //functionality to handle game option stand
    onStand(){
        if(!this.state.gameStatus.playerMode){
            return;
        }
        //dealer auto play logic
        let dealerHandVal = getHandValue(this.state.dealerHand);
        //dealer stands on 17, no card added to dealer's hand after the hand value reaches or crosses 17
        while(dealerHandVal<17){
            let dealerHand = this.state.dealerHand.slice();
            let randomCard = getRandomCard(this.cards);
            dealerHand.push(randomCard);
            dealerHandVal = getHandValue(dealerHand);
            this.setState({dealerHand: dealerHand, dealerHandValue: dealerHandVal});
        }
        //compatring the player and dealer hand to get the game status
        let gameStatus = compareHands({playerHand: this.state.playerHand, dealerHand: this.state.dealerHand});
        this.setState({gameStatus: {status: gameStatus, playerMode:false}});
    }

    //Resetting the complete game status to initial state
    onReset(){
        this.cards = generateDeck(1);
        let playerHand = [], dealerHand = [];
        playerHand.push(getRandomCard(this.cards))
        playerHand.push(getRandomCard(this.cards))
        dealerHand.push(getRandomCard(this.cards))
        dealerHand.push(getRandomCard(this.cards))

        let playerHandVal = getHandValue(playerHand);
        let dealerHandVal = getHandValue(dealerHand);

        if(playerHandVal === 21){
            this.setState({
                playerHand: playerHand,
                dealerHand: dealerHand,
                gameStatus: {status:"BlackJack", playerMode: false},
                playerHandValue: playerHandVal,
                dealerHandValue: dealerHandVal
            });
        }else{
            this.setState({
                playerHand: playerHand,
                dealerHand: dealerHand,
                gameStatus: {status:"In Progress", playerMode: true},
                playerHandValue: playerHandVal,
                dealerHandValue: dealerHandVal
            });
        }
    }

    render(){
        let status = this.state.gameStatus.status;
        let faceDownCard = this.state.gameStatus.playerMode ? true : false;

        return(
            <div className="container">
                <div className="flex-center flex-column">
                    <div className="flex-center flex-row">
                        <h1>Dealer</h1>
                    </div>
                    <Hand hand={this.state.dealerHand} faceDownCard={faceDownCard} />                    
                </div>

                <div className="flex-center flex-column">
                    <div className="flex-center flex-row">
                        <div className="game-options">
                            <button id="btnstand" className="btn" onClick={()=>this.onStand(this)}>Stand</button>
                            <button id="btnhit" className="btn" onClick={()=>this.onHit(this)}>Hit</button>
                            <button id="btnreset" className="btn" onClick={()=>this.onReset(this)}>Reset</button>                                                       
                        </div>
                    </div>
                    <div className="status flex-center flex-row">                        
                        <h1>Game Status: {status}</h1>                                                                                
                    </div>
                </div>                                

                <div className="flex-center flex-column">
                    <div className="flex-center flex-row">
                        <h1>Player</h1>
                    </div>
                    <Hand hand={this.state.playerHand} faceDownCard={false}/>                    
                </div>
            </div>
        );
    }
}

//generates and returns a card deck
function generateDeck(numOfDecks = 1){
    let cards = [];
    for(let i=0; i<numOfDecks; i++){
        for(let j=0; j<13; j++){
            let notation = '', val;
            if(j<9){
                notation += j+2;
                val = j+2;
            }
            if(j===9){
                notation = 'J';
                val = 10
            }
            if(j===10){
                notation = 'Q';
                val = 10
            }
            if(j===11){
                notation = 'K';
                val = 10
            }
            if(j===12){
                notation = 'A';
                val = 11
            }
            cards.push({
                notation: notation, suit: 'hearts', value: val,
            })
            cards.push({
                notation: notation, suit: 'spades', value: val,
            })
            cards.push({
                notation: notation, suit: 'clubs', value: val,
            })
            cards.push({
                notation: notation, suit: 'diamonds', value: val,
            })
        }
    }
    return cards;
}

//draws random card from the card deck and updates the card deck
function getRandomCard(cards){
    let len = cards.length;
    let randomIdx = Math.floor((Math.random()*1000)%len);
    let retObj = cards[randomIdx];
    cards.splice(randomIdx, 1);
    return retObj;
}

//calculates hand value and considers ace value 1 or 11 as per the hand benefits
function getHandValue(handObj){
    let handVal = 0, numOfAces = 0;
    for(let i=0; i<handObj.length; i++){
        if(handObj[i].notation === 'A'){
            numOfAces += 1;
        }
        handVal += handObj[i].value;
        if(handVal > 21 && numOfAces > 0){
            handVal -= numOfAces * 10;
            numOfAces -= 1
        }
    }
    return handVal;
}

//compares player and dealer hand to decide the winner
function compareHands(props){
    let playerHandVal = getHandValue(props.playerHand);
    let dealerHandVal = getHandValue(props.dealerHand);
    if(playerHandVal > 21){
        return "Busted";
    }
    if(playerHandVal <=21 && dealerHandVal <=21 && playerHandVal === dealerHandVal){
        return "Tie (Push)";
    }
    if( (playerHandVal <=21 && playerHandVal > dealerHandVal) || dealerHandVal > 21){
        return "Won";
    }
    if( (dealerHandVal <=21 && dealerHandVal > playerHandVal) || playerHandVal > 21){
        return "Lost";
    }
}

export {Game, Hand, Card, generateDeck, getRandomCard, getHandValue, compareHands};