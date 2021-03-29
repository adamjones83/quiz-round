# Quiz Round Models
## Quizzer
- id, name, abbrName, teamName
- 'teamName' is used in lineup selection, all quizzers matching the teamName will be avilable to select

## Team
- id, name, abbrName

## Lineup
- id, teamId, quizzer1, quizzer2, quizzer3, quizzer4, quizzer5, captainId, coCaptainId
- lineups in database are "default" lineups - when a team is selected in the lineup selection
  the default lineup for that team is filled in
- lineups set via the dialog are for the current quiz round
- any quizzer in the system can be selected for a lineup but those with a matching teamName
  will be at the top of the list for easy selection
- captain, cocaptian are only available from the selected quizzers in the lineup

## Score
- id, roundId, meetId, teamId, quizzerId, isTeamOnly, value, type, createdOn, isManual
- isTeamOnly is a flag that indicates a score does not apply to the associated quizzer's personal score
- isManual is a flag that indicates it was added manually - a kind of asterisk to show it was added as a manual correction

## Meet
- id, name, startsOn
- a quiz meet is a set of related rounds as part of a local, district, regional, national, or invitational quiz

## Rounds
- id, name, startsOn
- a round is a specific quiz match that is either part of a meet, or possibly unattached as part of a practice


