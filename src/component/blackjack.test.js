import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Game, Hand, Card, generateDeck, getRandomCard, getHandValue, compareHands} from './blackjack';

configure({ adapter: new Adapter() });

describe("Card deck", () => {
    let cardDeckNum = 1;
    let cards = generateDeck(cardDeckNum);
    it('Length', () => {
      expect(cards).toHaveLength(cardDeckNum * 52);
    });
    it('First card', () => {
      let initailCard = {notation: '2', suit: 'hearts', value: 2};
      expect(cards[0]).toEqual(initailCard);
    });
    it('Last card', () => {
      let finalCard = {notation: 'A', suit: 'diamonds', value: 11};
      expect(cards[cards.length-1]).toEqual(finalCard);
    });
    it('Draw random card', () => {
      let cardsNum = cards.length;
      let card = getRandomCard(cards);
      let newCardsNum = cards.length;
      expect(newCardsNum).toBe(cardsNum-1);
    })
});

describe("Get hand value", () => {

  it('Number Cards', () =>{
    let handObj = [];
    handObj.push({notation: "2", suit: "hearts", value: 2});
    handObj.push({notation: "4", suit: "clubs", value: 4});
    handObj.push({notation: "8", suit: "spades", value: 8});
    expect(getHandValue(handObj)).toBe(14);
  })

  it('Face Cards', () =>{
    let handObj = [];
    handObj.push({notation: "K", suit: "diamonds", value: 10});
    handObj.push({notation: "J", suit: "hearts", value: 10});
    handObj.push({notation: "8", suit: "spades", value: 8});
    expect(getHandValue(handObj)).toBe(28);
  })

  it('Ace card value 11', () =>{
    let handObj = [];
    handObj.push({notation: "A", suit: "clubs", value: 11});
    handObj.push({notation: "K", suit: "hearts", value: 10});
    expect(getHandValue(handObj)).toBe(21);
  })

  it('Ace card value 1', () =>{
    let handObj = [];
    handObj.push({notation: "A", suit: "clubs", value: 11});
    handObj.push({notation: "8", suit: "spades", value: 8});
    handObj.push({notation: "6", suit: "hearts", value: 6});
    expect(getHandValue(handObj)).toBe(15);
  })

})

describe("Compare hands", () => {

  it("Player busted", () => {
    let playerHand = [];
    playerHand.push({notation: "K", suit: "spades", value: 10});
    playerHand.push({notation: "4", suit: "spades", value: 4});
    playerHand.push({notation: "8", suit: "hearts", value: 8});
    let dealerHand = [];
    dealerHand.push({notation: "9", suit: "spades", value: 9});
    dealerHand.push({notation: "4", suit: "spades", value: 4});
    expect(compareHands({playerHand: playerHand, dealerHand: dealerHand})).toBe("Busted");
  })

  it("Dealer busted", () => {
    let dealerHand = [];
    dealerHand.push({notation: "K", suit: "spades", value: 10});
    dealerHand.push({notation: "4", suit: "spades", value: 4});
    dealerHand.push({notation: "8", suit: "hearts", value: 8});
    let playerHand = [];
    playerHand.push({notation: "9", suit: "spades", value: 9});
    playerHand.push({notation: "4", suit: "spades", value: 4});
    expect(compareHands({playerHand: playerHand, dealerHand: dealerHand})).toBe("Won");
  })

  it("Player high hand", () => {
    let dealerHand = [];
    dealerHand.push({notation: "4", suit: "spades", value: 4});
    dealerHand.push({notation: "8", suit: "hearts", value: 8});
    let playerHand = [];
    playerHand.push({notation: "9", suit: "spades", value: 9});
    playerHand.push({notation: "4", suit: "spades", value: 4});
    playerHand.push({notation: "4", suit: "spades", value: 4});
    expect(compareHands({playerHand: playerHand, dealerHand: dealerHand})).toBe("Won");
  })

  it("Dealer high hand", () => {
    let dealerHand = [];
    dealerHand.push({notation: "4", suit: "spades", value: 4});
    dealerHand.push({notation: "8", suit: "hearts", value: 8});
    dealerHand.push({notation: "9", suit: "spades", value: 9});
    let playerHand = [];
    playerHand.push({notation: "9", suit: "spades", value: 9});
    playerHand.push({notation: "4", suit: "spades", value: 4});
    expect(compareHands({playerHand: playerHand, dealerHand: dealerHand})).toBe("Lost");
  })

  it("Tie", () => {
    let dealerHand = [];
    dealerHand.push({notation: "4", suit: "spades", value: 4});
    dealerHand.push({notation: "8", suit: "hearts", value: 8});
    let playerHand = [];
    playerHand.push({notation: "9", suit: "spades", value: 9});
    playerHand.push({notation: "3", suit: "spades", value: 3});
    expect(compareHands({playerHand: playerHand, dealerHand: dealerHand})).toBe("Tie (Push)");
  })

})

describe("BlackJack Game", () => {
  
  it('Game container renders correctly', () => {
    const gamewrapper = shallow(<Game />);
    expect(gamewrapper).toMatchSnapshot();
  });

  it('Hand container renders correctly', () => {
    let handObj = [];
    handObj.push({notation: "A", suit: "clubs", value: 11});
    handObj.push({notation: "8", suit: "spades", value: 8});
    handObj.push({notation: "6", suit: "hearts", value: 6});
    const gamewrapper = shallow(<Hand hand={handObj} faceDownCard={false}/>);
    expect(gamewrapper).toMatchSnapshot();
  });

  it('Initial hands', () => {
    const gamewrapper = shallow(<Game />);
    expect(gamewrapper.state('playerHand')).toHaveLength(2);
    expect(gamewrapper.state('dealerHand')).toHaveLength(2);
  });

  it('Player hits', () => {
    const gamewrapper = shallow(<Game />);
    const buttonElement = gamewrapper.find('#btnhit');
    let initialCards = 2;
    while(gamewrapper.state('gameStatus').playerMode){
      buttonElement.simulate('click');
      initialCards += 1;
      expect(gamewrapper.state('playerHand')).toHaveLength(initialCards);
    }
  });

  it('Dealer stands on 17', () => {
    const gamewrapper = shallow(<Game />);
    const buttonElement = gamewrapper.find('#btnstand');
    let initialCards = 2;
    let initialDealerHandValue = gamewrapper.state('dealerHandValue');
    if(initialDealerHandValue >= 17){
      buttonElement.simulate('click');
      expect(gamewrapper.state('dealerHand')).toHaveLength(initialCards);
    } else {
      buttonElement.simulate('click');
      expect(gamewrapper.state('dealerHandValue')).toBeLessThan(27);
    }
  });

  it('Declare Winner', () => {
    const gamewrapper = shallow(<Game />);
    const buttonElement = gamewrapper.find('#btnhit');
    const buttonElement2 = gamewrapper.find('#btnstand');
    buttonElement.simulate('click');
    buttonElement.simulate('click');
    buttonElement2.simulate('click');
    let playerHandVal = gamewrapper.state('playerHandValue');
    let dealerHandVal = gamewrapper.state('dealerHandValue');
    let status = gamewrapper.state('gameStatus').status;
    if( playerHandVal == 21 && playerHandVal.length == 2){
      expect(status).toBe("BlackJack");
    }else if( playerHandVal > 21){
      expect(status).toBe("Busted");
    }else if(playerHandVal > dealerHandVal){
      expect(status).toBe("Won");
    }else if(dealerHandVal > 21){
      expect(status).toBe("Won");
    }else if(dealerHandVal > playerHandVal){
      expect(status).toBe("Lost");
    }else if(dealerHandVal == playerHandVal){
      expect(status).toBe("Tie (Push)");
    }
  });

});