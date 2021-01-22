# GoFish
Generates a Website to play GoFish against an AI

# What The Code Does
## A) The Set-Up
  1) The program will prompt the user for a player name. If left blank, a default name will be given.
  2) The program will prompt the user for a difficulty. The four difficulties are:
      1) Easy: The computer player asks for the cards randomly, regardless of what the player has asked for previously.
      2) Hard: The computer player asks for cards that both the player has had asked for before and the computer has, unless the player has paired that selection between then and          now. Otherwise, the computer randomly selects a card.
      3) Cheating-Easy: The computer will act the same way as in Easy Mode, but both players' cards will be visible to the player. Meant for debugging.
      4) Cheating-Hard: The computer will act the same way as in Hard Mode, but both players' cards will be visible to the player. Meant for debugging.
  3) The user is asked whether they would like to go first or second.
  4) The user is shown their selections up to that point. They will have the choice to restart from step 1, or to continue to the actual game.
  
  
## B) The Game
  1) At the beginning of the game, both players will draw seven cards. Any pairs that start in either player's opening hand will be removed and the owner of the pair will be         awarded a point per pair.
  
  2) Turn Structure:
    If it is the AI's turn:
       A) On either Easy Mode, the AI randomly selects a card in its hand and asks for it.
       B) On either Hard Mode, the AI will select a card in its hand if you've asked for it previously and not paired in since the time you've asked. If no such card exists, a            random card is asked for instead.
    On the player's turn, they are shown their hand and prompted to click on the image for the card they want to ask for. After clicking on it, they will be prompted to confirm      their selection.
    
    After either player has made their selection:
      A) If the other player had the requested card, the asking player removes the corresponding card from both hands, gains a point, and gets another turn.
      B) If the other player did not have the card, they will draw a card.
         1) If the card they drew is the one they asked for, they remove the pair from their hand, gain a point, and get another turn.
         2) If the card they drew was not the one they asked for but created a pair, they remove the pair from their hand and gain a point, but they do not get another turn.
         3) If the card they drew forms no pair, the turn is then given to other player.
         
  The game ends once there are no remaining cards in either player's hand or in the deck.
