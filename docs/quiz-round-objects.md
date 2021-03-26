## Quizzer
- id, name, abbrName, teamName
- 'teamName' is used in lineup selection, all quizzers matching the teamName will be avilable to select

## Team
- id, name, abbrName

## Lineup
- id, teamId, quizzer1, quizzer2, quizzer3, quizzer4, quizzer5, captainId, coCaptainId
- teamId is used in lineup selection - when a team is selected the lineup with a matching teamId is autofilled

## Score
- id, roundId, meetId, teamId, quizzerId, isTeamOnly, value, type, createdOn, isManual
- isTeamOnly is a flag that indicates a score does not apply to the associated quizzer's personal score
- isManual is a flag that indicates it was added manually - a kind of asterisk to show it was not part of the natural flow of a round, eg. a correction

## Meet
- id, name, startsOn
- a quiz meet is a set of related rounds as part of a local, district, regional, national, or invitational quiz

## Rounds
- id, name, startsOn
- a round is a specific quiz match that is either part of a meet, or possibly unattached as part of a practice


