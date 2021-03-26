import { QuizRoundClient } from './sqlite/data-layer';


async function main() {
    const client = QuizRoundClient('test.db');
    const quizzers = await client.getQuizzers();
    console.log({ quizzers });    
}


main().then(() => console.log('done'), err => console.error({ err }));