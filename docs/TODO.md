# TODO

## HARDWARE/ENVIRONMENT
- keyboard jump emulator
- serial port (USB) based jump handler
- virtual jumps via the internet (web sockets)?
- hook up preload script for functions that use node functionality
- data store for teams, players, lineups, round score history 
    ** move sample data here ^^^

## ACTIONS
- game specific actions
    * jump set
    * correct (add score & advance question)
    * error (add score item, set question state)
    * correct bonus
    * no bonus
- game specific actions as self dispatching debug actions

## UI
- dev/debug mode switch
    * enable debug display items in the view
    * enable self-dispatching debug actions on global object
- debug display for "question state"
- switch to use team abbrName for round display
- click to jump
- answering popup with timer
- ?? popup for timeout, challenge, appeal, rebuttal
- popup for changing lineups
    * select team (applies default lineup)
    * select quizzers

## QUESTION-STATE UI ACTIONS
- before: timeout, challenge, rebuttal, jumpset
- jumpset: clear, jump-timer, jumped
- answering: correct, error, cancel
- bonus: correct, error, cancel

## FEATURE IDEAS:
- website view
    * state gets streamed to a website
    * scoresheet view
    * scoreboard view (no action buttons, optional reverse team ordering)
- bonus redirect: allow specifying which seat should get the bonus from a given seat
- virtual jump seat: trigger a jump via a button on a website
- delayed jump: put a X millisecond delay in the jump handler before dispatching actions
- configurable correct before quiz out
- configurable error before error out
- randomized jump
