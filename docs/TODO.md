# TODO
- menu items: 
    * timeout, challenge, appeal, foul, show scores, select tournement
    * set question number
- Dialogs
    * team/quizzer select dialog (for fouls, timeouts, ...)
    * timeout dialog
    * challenge/rebuttal/appeal dialog
    * team, quizzer, meet input dialog
- Windows
    * audience view - hide actions, optional mirrored team orders
- Seats
    * enabling/disabling seats
    * testing
    * proper close/dispose of seat?
    * automatic reload on seat disconnect & reattach
    * windows computer support
    * UI click "jumping"
- Round Flow
    * state attributes - round start time, round id, meet id
    * options to start round, restart round
        - discard, save, or keep scores
        - set the round start time
    * set round title
    * method for selecting quiz meet
    * quiz outs, error outs, swapping quizzers, enable/disable seats
    * quiz round ends & saving scores
- Scores View
    * manually add scores
- UI/UX cleanup

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