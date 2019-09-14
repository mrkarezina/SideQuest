const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');

// load values from the .env file in this directory into process.env
dotenv.config();

// configure algolia
const algolia = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

const queryProjects = async (skills, interests) => {

    return (await index.search('projects', {
        // filters: 'skills:Python AND store:Gibert Joseph Saint-Michel'
        filters: 'skills:Python'
    }));
};

const addPorject = async(data) => {
    return (await index.addObject(data));
}

const a = async () => {
    console.log(await queryProjects(['Python']));
};

a();


// module.exports = {
//     queryProjects
// };

