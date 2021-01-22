# GoFish
Generates a Website to play GoFish against an AI

# What The Code Does
A) The Set-Up
  1) The program will prompt the user for a player name. If left blank, a default name will be given.
  2) The program will prompt the user for a difficulty. The four difficulties are:
      1) Easy: The computer player asks for the cards randomly, regardless of what the player has asked for previously.
      2) Hard: The computer player asks for cards that both the player has had asked for before and the computer has, unless the player has paired that selection between then and          now. Otherwise, the computer randomly selects a card.
      3) Cheating-Easy: The computer will act the same way as in Easy Mode, but both players' cards will be visible to the player. Meant for debugging.
      4) Cheating-Hard: The computer will act the same way as in Hard Mode, but both players' cards will be visible to the player. Meant for debugging.
  3) The user is asked whether they would like to go first or second.
  4) The user is shown their selections up to that point. They will have the choice to restart from step 
