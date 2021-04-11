# TODO
- edit meets, teams, quizzers
- ability to disable seats
- get "real" sample data
- bonus scores & round flow
- manually adding scores
- color order: [green, blue, red]
- quizzers disabled on quiz out & error out
- challenge/appeal dialogs without timers
- saving scores to database
- style updates
- support for Windows 10
- audience view
    - hide actions
    - optional mirrored team order
    - toast (3 second) for fouls (and appeals if they don't use a timer)
- seats
    - menu option to reconnect
    - proper close/dispose of seat?
    - automatic reload on seat disconnect & reattach?
    - UI click "jumping"
- UI/UX cleanup
    * consistent team ordering in dropdowns (by lineup when applicable, or alphabetical)
    * standardize 'Ok' text for buttons
    * standardize 'Ok', 'Cancel' order
    * prime button coloration
- keyboard shortcuts

## STRETCH
- debug mode
    * enables console.log debug statements for actions
    * debug UI elements (question state, ...)
    * self dispatching ACTIONS added to the window object

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