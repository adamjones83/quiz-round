"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.QuizRoundClient = void 0;
var sqlite3_1 = require("sqlite3");
function toLineup(dbLineup) {
    return {
        id: dbLineup.id,
        teamId: dbLineup.teamId,
        quizzerIds: __spreadArrays(new Array(5)).map(function (_, index) { return dbLineup["quizzerId" + index]; }),
        captainId: dbLineup.captainId,
        coCaptainId: dbLineup.coCaptainId
    };
}
function QuizRoundClient(filepath) {
    function runCommand(command, paramObj) {
        return new Promise(function (res, rej) {
            var db = new sqlite3_1.Database(filepath);
            db.run(command, paramObj, function (err) { if (err)
                rej(err);
            else
                res(undefined); });
            db.close();
        });
    }
    function getAllQuery(query) {
        return new Promise(function (res, rej) {
            var db = new sqlite3_1.Database(filepath);
            db.all(query, function (err, rows) {
                if (err)
                    rej(err);
                else
                    res(rows);
            });
            db.close();
        });
    }
    function insertQuizzer(quizzer) {
        return runCommand("INSERT INTO quizzers (id, name, abbrName, teamName) values ($id, $name, $abbrName, $teamName)", { $id: quizzer.id, $name: quizzer.name, $abbrName: quizzer.abbrName, $teamName: quizzer.teamName });
    }
    function getQuizzers() {
        return getAllQuery("SELECT * FROM quizzers");
    }
    function insertTeam(team) {
        return runCommand("INSERT INTO teams (id, name, abbrName) values ($id, $name, $abbrName)", { $id: team.id, $name: team.name, $abbrName: team.abbrName });
    }
    function getTeams() {
        return getAllQuery("SELECT * FROM teams");
    }
    function insertLineup(lineup) {
        var quizzerIds = __spreadArrays(new Array(5)).map(function (_, index) { return lineup.quizzerIds[index]; });
        return runCommand("INSERT INTO lineups (id, teamId, quizzerId1, quizzerId2, quizzerId3, quizzerId4, quizzerId5, captainId, coCaptainId) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", __spreadArrays([lineup.id, lineup.teamId], quizzerIds, [lineup.captainId, lineup.coCaptainId]));
    }
    function getLineups() {
        return getAllQuery("SELECT * FROM lineups")
            .then(function (dbLineups) { return dbLineups.map(toLineup); });
    }
    function insertMeet(meet) {
        return runCommand("INSERT INTO meets (id,name,startsOn) values ($id,$name,$startsOn)", { $id: meet.id, $name: meet.name, $startsOn: meet.startsOn });
    }
    function getMeets() {
        return getAllQuery("SELECT * FROM meets");
    }
    function insertRound(round) {
        return runCommand("INSERT INTO rounds (id,meetId,name,startsOn) values ($id,$meetId,$name,$startsOn)", { $id: round.id, $meetId: round.meetId, $name: round.name, $startsOn: round.startsOn });
    }
    function getRounds() {
        return getAllQuery("SELECT * FROM rounds");
    }
    // TODO: impement this, but probably should insert an array of scores cause one at a time would be pointlessly slow
    function insertScore(score) {
        throw 'not implemented';
    }
    function getScores() {
        return getAllQuery("SELECT * FROM scores");
    }
    return {
        insertQuizzer: insertQuizzer, getQuizzers: getQuizzers,
        insertTeam: insertTeam, getTeams: getTeams,
        insertLineup: insertLineup, getLineups: getLineups,
        insertMeet: insertMeet, getMeets: getMeets,
        insertRound: insertRound, getRounds: getRounds,
        insertScore: insertScore, getScores: getScores
    };
}
exports.QuizRoundClient = QuizRoundClient;
