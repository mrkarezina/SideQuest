const algoliasearch = require('algoliasearch');
let firebase = require('firebase-admin');
const dotenv = require('dotenv');

const seedProjects = require('./seedProjects.json');

// load values from the .env file in this directory into process.env
dotenv.config();

let serviceAccount = require("./graph-intelligence-e29273f12d3b.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://graph-intelligence.firebaseio.com"
});

const database = firebase.database();

// configure algolia
const algolia = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
);
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

// Adding seed projects to firebase
Promise.all(
    seedProjects.map((project) => {
        return database.ref('/projects').push(project)
    })).then(() => {
    console.log("Project added to Firebase");
}).catch(error => {
    console.error("Error adding contacts to Firebase", error);
});

// Importing to Algolia
// Get all projects from Firebase
database.ref('/projects').once('value', projects => {
    // Build an array of all records to push to Algolia
    const records = [];
    projects.forEach(project => {
        // get the key and data from the snapshot
        const childKey = project.key;
        const childData = project.val();
        // We set the Algolia objectID as the Firebase .key
        childData.objectID = childKey;
        // Add object for indexing
        records.push(childData);
    });

    // Add or update new objects
    index
        .saveObjects(records)
        .then(() => {
            console.log('Projects imported into Algolia');
            process.exit(0)
        })
        .catch(error => {
            console.error('Error when importing projects into Algolia', error);
        });
});

// Set attributes for filtering
index.setSettings({
    attributesForFaceting: [
        'skills',
        'interests'
    ]
});