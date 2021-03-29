import { QuizRoundClient } from './lib/data-layer';
import { generateTeams, generateQuizzers, generateDefaultLineups } from './sample/generate-sample-data';

async function main() {
    const client = QuizRoundClient('sample.db');
    const teams = generateTeams();
    const quizzers = generateQuizzers();
    const lineups = generateDefaultLineups(teams, quizzers);

    // set the team name for these generated quizzers from the generated lineups
    const teamLookup = toLookup(teams, t=>t.id);
    quizzers.forEach(quizzer => {
        const teamId = lineups.find(a => a.quizzerIds.includes(quizzer.id))?.teamId;
        quizzer.teamName = teamLookup[teamId]?.name || 'unknown';
    })
    
    console.log('inserting teams');
    await client.insertTeams(teams);
    console.log('inserting quizzers');
    await client.insertQuizzers(quizzers);
    console.log('inserting lineups');
    await client.insertLineups(lineups);
}

function toLookup<T>(items:T[], keySelector: (item:T)=>string) {
    return items.reduce((lookup,item) => {
        const key = keySelector(item);
        lookup[key] = item;
        return lookup;
    }, { } as Record<string,T>);
}

main().then(() => console.log('done'), err => console.error({ err }));