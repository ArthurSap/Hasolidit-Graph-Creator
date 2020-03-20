/*jshint esversion: 8 */
const MongoClient = require('mongodb').MongoClient;

const dbUrl = "mongodb://localhost:27017/";
const dbName = 'hasoliditDB';
const graphCollectionName = 'graphData';

let client;

module.exports = async () => {
    try {
        client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    } catch (e) {
        console.error("Could not connect to mongodb");
    }
};
    
module.exports.get = () => client;
module.exports.close = () => client.close();
module.exports.dbUrl = dbUrl;
module.exports.dbName = dbName;
module.exports.graphCollectionName = graphCollectionName;