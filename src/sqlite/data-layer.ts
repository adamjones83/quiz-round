import { Database } from 'sqlite3';
import { Quizzer, Team, Lineup, Meet, Round, Score } from '../data/types'

interface DbLineup {
    id:string,
    teamId:string,
    quizzerId1?:string,
    quizzerId2?:string,
    quizzerId3?:string,
    quizzerId4?:string,
    quizzerId5?:string,
    captainId?:string,
    coCaptainId?:string
}

function toLineup(dbLineup:DbLineup) {
    return {
        id: dbLineup.id,
        teamId: dbLineup.teamId,
        quizzerIds: [...new Array(5)].map((_,index) => dbLineup[`quizzerId${index}`]),
        captainId: dbLineup.captainId,
        coCaptainId: dbLineup.coCaptainId
    } as Lineup;
}



export function QuizRoundClient(filepath:string) {
    function runCommand(command:string, paramObj: {[key:string]:unknown}|unknown[]) {
        return new Promise((res,rej) => {
            const db = new Database(filepath);
            db.run(command, paramObj, err => { if(err) rej(err); else res(undefined); });
            db.close();
        })
    }
    function getAllQuery<T>(query:string) {
        return new Promise<T[]>((res,rej) => {
            const db = new Database(filepath);
            db.all(query, (err,rows) =>{
                if(err) rej(err);
                else res(rows);
            });
            db.close();
        });
    }
    
    function insertQuizzer(quizzer:Quizzer) {
        return runCommand("INSERT INTO quizzers (id, name, abbrName, teamName) values ($id, $name, $abbrName, $teamName)",
            { $id: quizzer.id, $name: quizzer.name, $abbrName: quizzer.abbrName, $teamName: quizzer.teamName });
    }
    function getQuizzers() {
        return getAllQuery<Quizzer>("SELECT * FROM quizzers");
    }

    function insertTeam(team:Team) {
        return runCommand("INSERT INTO teams (id, name, abbrName) values ($id, $name, $abbrName)",
            { $id: team.id, $name: team.name, $abbrName: team.abbrName });
    }
    function getTeams() {
        return getAllQuery<Team>("SELECT * FROM teams");
    }

    function insertLineup(lineup:Lineup) {
        const quizzerIds = [...new Array(5)].map((_,index) => lineup.quizzerIds[index]);
        return runCommand("INSERT INTO lineups (id, teamId, quizzerId1, quizzerId2, quizzerId3, quizzerId4, quizzerId5, captainId, coCaptainId) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [lineup.id, lineup.teamId, ...quizzerIds, lineup.captainId, lineup.coCaptainId]);
    }
    function getLineups() {
        return getAllQuery<DbLineup>("SELECT * FROM lineups")
            .then(dbLineups => dbLineups.map(toLineup));
    }

    function insertMeet(meet:Meet) {
        return runCommand("INSERT INTO meets (id,name,startsOn) values ($id,$name,$startsOn)", 
            { $id: meet.id, $name: meet.name, $startsOn: meet.startsOn });
    }
    function getMeets() {
        return getAllQuery<Meet>("SELECT * FROM meets");
    }

    function insertRound(round:Round) {
        return runCommand("INSERT INTO rounds (id,meetId,name,startsOn) values ($id,$meetId,$name,$startsOn)",
            { $id:round.id, $meetId:round.meetId, $name:round.name, $startsOn:round.startsOn })
    }
    function getRounds() {
        return getAllQuery<Round>("SELECT * FROM rounds");
    }
    
    // TODO: impement this, but probably should insert an array of scores cause one at a time would be pointlessly slow
    function insertScore(score:Score) {
        throw 'not implemented'
    }
    function getScores() {
        return getAllQuery<Score>("SELECT * FROM scores");
    }
    
    return { 
        insertQuizzer, getQuizzers,
        insertTeam, getTeams,
        insertLineup, getLineups,
        insertMeet, getMeets,
        insertRound, getRounds,
        insertScore, getScores
    };
}