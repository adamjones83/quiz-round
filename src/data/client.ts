import { Team, Quizzer } from './types';

export function Client() {
    const getTeams = async () => {
        const teams = await fetch('data/teams.json').then(a => a.json()) as Team[];
        for(const team of teams) team.abbrName = team.name;
        return teams;
    }
    const getQuizzers = async () => {
        const quizzers = await fetch('data/quizzers.json').then(a => a.json()) as Quizzer[];
        for(const quizzer of quizzers) quizzer.abbrName = appreviateName(quizzer.name);
        return quizzers;
    }
    return {
        getTeams, getQuizzers
    };
}

function appreviateName(name:string) {
    const [first,last] = name.split(' ');
    return `${first} ${last[0]}`
}