import { Quizzer, Team } from '../redux/types'
import { nanoid } from 'nanoid';
import { writeFile } from 'fs/promises';
const quizzerNames: string[] = [
  "Shannon Castillo",
  "Jescie Little",
  "Hannah Castillo",
  "Sierra Austin",
  "Norman Barr",
  "Jared Guy",
  "Thor Torres",
  "Kevin Russell",
  "Hayes Briggs",
  "Malachi Alford",
  "Bert Berg",
  "Rhonda Vinson",
  "Carl Wheeler",
  "Katelyn Fowler",
  "Ori Odonnell",
  "Cheyenne Harmon",
  "Halee Raymond",
  "Priscilla Underwood",
  "Daniel Vaughn",
  "Quinn Rhodes",
  "Jolie Tucker",
  "Inez Conner",
  "Salvador Schroeder",
  "Jael Estes",
  "Lyle Velasquez",
  "Jorden Henson",
  "Amelia Harrell",
  "Deacon Dillard",
  "Holmes Byrd",
  "Joan Allison",
  "Chancellor Floyd",
  "Dawn Noel",
  "Darius Hutchinson",
  "Stella Ratliff",
  "Astra Alvarez",
  "Adria Valdez",
  "Grant Curry",
  "Jada Trujillo",
  "Colton Colon",
  "Dieter Gilliam",
  "Uma Bird",
  "Rooney Snow",
  "Carissa Perkins",
  "Beck Gross",
  "Cameron Baird",
  "Macy Joyner",
  "Hayden Richard",
  "Kennedy George",
  "Beverly Chavez",
  "Amber Gill",
  "Karina Dale",
  "Maite Warner",
  "Kaitlin Barber",
  "Yvette Boone",
  "Myles Christensen",
  "Imogene Odom",
  "Barry Gomez",
  "Eric Wooten",
  "Tasha Brown",
  "Chiquita Rocha",
  "Myles Mcfarland",
  "Mercedes Weeks",
  "Hedda Stokes",
  "Phillip Cherry",
  "Jasmine Buckley",
  "Berk Alford",
  "Denise Kinney",
  "Scarlet Mathews",
  "Denton Luna",
  "Mechelle Barnes",
  "Marcia Noel",
  "Morgan Fleming",
  "Thane Petersen",
  "Heidi Rhodes",
  "Denton Dalton",
  "Sara Avery",
  "Graiden Davenport",
  "Finn Sawyer",
  "Reed Michael",
  "Hector Dawson",
  "Jasmine Blackwell",
  "Isabelle York",
  "Samson Alexander",
  "Petra Mooney",
  "Dane Mcmillan",
  "Leigh Mcneil",
  "Simon Wise",
  "Tatum Long",
  "Denton Ingram",
  "Kaye Wilkins",
  "Linda Monroe",
  "Kirsten Sellers",
  "Georgia Kent",
  "Skyler Cummings",
  "Brendan Snow",
  "Joan Hicks",
  "Solomon Riggs",
  "Malachi Hooper",
  "Brendan Knox",
  "Ulla Wilkerson",
];
const teamNames: string[] = [
    "Temple First Church",
    "Georgetown",
    "Hill Country",
    "Killeen",
    "Waco",
    "Belton",
    "Central City Austin",
    "South Austin",
    "Cove",
    "Community Fellowship",
    "San Antonio First"
];

export function generateQuizzers() {
    return quizzerNames.map(name => ({
        id: nanoid(),
        name, 
    })) as Quizzer[];
}
export function generateTeams() {
    return teamNames.map(name => ({
        id: nanoid(),
        name
    })) as Team[];
}
export function setDefaultLineups(teams:Team[], quizzers:Quizzer[]) {
    const shuffled = shuffle(quizzers);
    teams.forEach(team => {
        const quizzerIds = shuffled.splice(0,5).map(a => a.id);
        team.defaultLineup = {
            teamId: team.id,
            quizzerIds,
            captainId: quizzerIds[0],
            coCaptainId: quizzerIds[1]
        };
    });
}
function shuffle<T>(items:T[]) {
    const shuffled = [...items];
    let swapIndex = -1;
    for(let i=shuffled.length;i>0;i--) {
        swapIndex = Math.floor(Math.random() * i);
        [shuffled[swapIndex],shuffled[i-1]] = [shuffled[i-1],shuffled[swapIndex]];
    }
    return shuffled;
}

const quizzers = generateQuizzers();
const teams = generateTeams();
setDefaultLineups(teams, quizzers);
Promise.resolve()
    .then(() => writeFile('quizzers.json', JSON.stringify(quizzers, null, '\t')))
    .then(() => writeFile('teams.json', JSON.stringify(teams, null, '\t')))
    .then(
        () => console.log('generated teams.json and quizzers.json'),
        err => console.error(err)
    );
    