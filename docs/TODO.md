# TODO
- debug mode
    * enables console.log debug statements for actions
    * debug UI elements (question state, ...)
    * self dispatching ACTIONS added to the window object
- menu items: 
    * timeout, challenge, appeal, foul, show scores, select tournement
    * set question number
- timers (answering, timeout, challenge, ...)
- bonus points: see & implement all point types in types.ts
- round start time, set round id, quiz/tournement id
- hook up seat-connector, add seat handler function that takes a set of seat statuses
- windows seat-connector support
- ability to disable seats
- scores view, add/remove
- audience view - hide action buttons, optional mirrored team orders
- general UI cleanup

## ROUND FLOW
- start time set when app is opened
- menu option to "Start Round"
    * sets round id, start time
    * if there's already scores, options to (clear, save, keep for this round)
- menu option to pick quiz/tournement that updates quiz/tournement id
- dialog for creating a tournament { name, startdate }, saves to db
- dialog for setting the round title
- when scores are saved at the end of a round the round { id, title } is saved with them

## JUMPING
- jump handler takes mutiple sources
- seat ids not necessarily tied to round UI
- Seats, keyboard seats, virtual (via web), UI click

## QUESTION-STATE UI ACTIONS
- before: timeout, challenge, rebuttal, jumpset
- jumpset: clear, jump-timer, jumped
- answering: correct, error, cancel
- bonus: correct, error, cancel

## FEATURE IDEAS:
- API endpoints to stream state
    * configurable port #
    * API key authentication
    * configurable disable on startup
- website view
    * state gets streamed to a website
    * scoresheet view
    * scoreboard view (no action buttons, no lineup popup, optional reverse team ordering)
    * seat states, jumped quizzer view
- bonus redirect: allow specifying which seat should get the bonus from a given seat
- virtual jump seat: trigger a jump via a button on a website
    * phone/tablet optimized view
- delayed jump: put a X millisecond delay in the jump handler before dispatching actions
- configurable correct count before quiz out
- configurable error count before error out
- meet & team as optional which treats the data as a practice round (possibly still saved in db?)
- data saved in a centralized database like MySQL