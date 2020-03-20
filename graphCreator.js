/*jshint esversion: 8 */

const cytoscape = require("cytoscape");
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { get, close ,graphCollectionName, dbName } = require('./db');
const connect = require('./db');
const sem = require('semaphore')(1);

let cy = cytoscape({
    headless: true
});

let finishedLinks = [];
let visitedLinks = [];

const resultJsonPath = './res.json';
const initialLink = 'http://www.hasolidit.com/15-%d7%a2%d7%a6%d7%95%d7%aa-%d7%a1%d7%95%d7%9c%d7%99%d7%93%d7%99%d7%95%d7%aa-%d7%9c%d7%91%d7%a0%d7%99-20';
let website = new URL(initialLink);
website = website.hostname;

const insertDataToDB = async (collection, id, title, link, linksArr, parent='') => {
    console.log(`Inserting ${id}`);
    try {
        return await collection.insertOne({
            _id: id,
            title: title,
            link: link,
            linksArr: linksArr,
            parent: parent
        });
    } catch(err) {
        console.error(err);
        process.kill(process.pid, "SIGINT");
    }
};

const getDataById = async (collection, id) => {
    console.log(`Retreiving data for ${id}`);
    try {
        return await collection.findOne({_id: id});
    } catch(err) {
        console.error(err);
        process.kill(process.pid, "SIGINT");
    }
}

const fetchData = async link => {
    try {
        console.log(`fetching data for ${link}`);
        const result = await axios.get(link);
        const data = await result.data;
        const $ = await cheerio.load(data, { normalizeWhitespace: true });
        return $;
    } catch(err) {
        console.error(err);
        fs.writeFileSync(resultJsonPath, JSON.stringify(cy.json()));
        close();
        process.abort();
    }
};

const checkRelevantLink = (i, link) => {
    return !(/\.(jpeg|jpg|gif|png)$/.test(link.attribs.href));
};

const getRelevantLinks = $ => {
    let lst = [];
    $('p > a, ul > a', '.entry').filter(checkRelevantLink).each((i, link) => {
        lst.push(link.attribs.href.replace('https', 'http'));
    });
    console.log(`Got total of ${lst.length} links.`);
    return lst;
};

const getPostTitle = $ => {
    return $('.name.post-title.entry-title').text();
};

const createVertexFromLinkHTM = ($, hrefLink) => {
    console.log(`Creating new vertex for ${hrefLink}`);
    try {
        return [hrefLink, getPostTitle($), hrefLink];
    } catch(err) {
        console.error(`Problem with link ${hrefLink}`);
        throw err;
    }
};

const addVertexToDB = async (id, title, link, linksArr, parent) => {
    try {
        const collection = await get().db(dbName).collection(graphCollectionName);
        await insertDataToDB(collection, id, title, link, linksArr, parent);
        console.log(`Vertex ${id} inserted to DB.`);
    } catch(err) {
        console.error(err);
        process.kill(process.pid, "SIGINT");
    }
};

const addVertexToGraph = async (id, title, link) => {
    try {
        await cy.add({
            data: {
                id: id,
                title: title,
                link: link
            }
        });
        console.log(`Added vertex for ${id}`);
    } catch (err) {
        console.error(err);
    }
};

const addNewVertex = async (id, title, link, linksArr, parent) => {
    await addVertexToDB(id, title, link, linksArr, parent);
    await addVertexToGraph(id, title, link);
};

const addEdge = async (source, target) => {
    if(cy.edges(`[source="${source}"][target="${target}"]`).length > 0) {
        console.log(`Edge from ${source} to ${target} already exists.`);
        return;
    }

    await cy.add({
        data: {
            source: source,
            target: target
        }
    });
    console.log(`Added edge from ${source} to ${target}`);
};

const isLinkExternal = link => {
    return !link.includes(website);
};

const parseNewLink = async (postLink, parent) => {
    console.log(`Parsing new link ${postLink}`);
    if(isLinkExternal(postLink)) {
        return; // await addNewVertex(postLink, postLink, postLink, [], parent);
    }
    const $ = await fetchData(postLink);
    const [baseId, baseTitle, baseLink] = createVertexFromLinkHTM($, postLink);
    const links = getRelevantLinks($);
    await addNewVertex(baseId, baseTitle, baseLink, links, parent);
    return {
        _id: baseId,
        title: baseTitle,
        link: baseLink,
        linksArr: links
    };
};

const getExistingVertex = async (id, collection, parent) => {
    // const maybeExistingVertex = cy.$id(id);
    // if(maybeExistingVertex.length > 0) {
    //     return maybeExistingVertex.data();
    // }
    return await getDataById(collection, id) || await parseNewLink(id, parent);
    
}

const insideSemaphoreFunc = async (mainLink, subLink) => {
    await getResults(subLink, mainLink);
    await addEdge(mainLink, subLink);
    setTimeout(sem.leave, 4000);
};

const getResults = async (postLink, parent) => {
    const postLinkUnSafe = postLink.replace('https', 'http');
    console.log(`Working on link: ${postLinkUnSafe}`);
    if(finishedLinks.includes(postLinkUnSafe)) {
        console.log(`Oops!! Link already finished! ${postLinkUnSafe}`);
    }

    visitedLinks.push(postLinkUnSafe);

    const client = await get();
    const collection = await client.db(dbName).collection(graphCollectionName);
    const data = await getExistingVertex(postLinkUnSafe, collection, parent);

    try {
        if(cy.$id(data.link).length === 0) {
            console.log(`Data found for ${data.link} but no vertex, adding.`);
            await addVertexToGraph(data._id, data.title, data.link);
        } else {
            console.log(`Data found in DB for ${data.link}`);
        }
    } catch(err) {
        console.log(`Weird problem with ${postLink} ||| ${parent}`);
        process.kill(process.pid, "SIGINT");
    }

    if(isLinkExternal(postLink)) {
        console.log('Link is external, returning');
        return;
    }

    for(let i = 0; i < data.linksArr.length; i++) {
        const link = data.linksArr[i];
        console.log(`Iterating over link ${link} `);
        if(isLinkExternal(link)) {
            console.log('Link is external, skipping...');
            continue;
        }
        if(finishedLinks.includes(link)) {
            console.log(`Link already finished! ${link}`);
            continue;
        }
        if(visitedLinks.includes(link)) {
            console.log(`Link has been visited! ${link}`);
            continue;
        }
        if(cy.$id(link).length > 0) {
            console.log(`${link} found in grpah!`);
            await addEdge(postLinkUnSafe, link);
        } else {
            console.log(`${link} not found :(`);
        }
        sem.take(() => insideSemaphoreFunc(postLinkUnSafe, link));   
    }
    finishedLinks.push(postLinkUnSafe);

};

const generalCleanup = () => {
    fs.writeFileSync(resultJsonPath, JSON.stringify(cy.json()));
    close();
    if(!(finishedLinks.length === visitedLinks.length && finishedLinks.every((value, index) => value === l3[index]))) {
        console.log('Problem! Arrays not equal');
        console.log(finishedLinks, visitedLinks);
    }
};

const errorCleanup = () => {
    console.log('Error occured! Cleaning...');
    generalCleanup();
    process.abort();
};

const gracefulCleanup = () => {
    console.log('Cleaning (gracefully)...');
    generalCleanup();
};

process.on('SIGINT', errorCleanup);
process.on('SIGTERM', errorCleanup);
process.on('exit', gracefulCleanup);

try {
    const rawdata = fs.readFileSync(resultJsonPath);
    console.log('Reading Json file...');
    cy.json(JSON.parse(rawdata));
} catch(err) {
    console.error(err);
}
connect().then(async () => await getResults(initialLink, '')).catch( err => {
    console.error(err);
    errorCleanup();
});
// const relevantChildren = $('div[class=entry]')[0].children.filter(child => ['p', 'h2', 'ul'].includes(child.name));
// let rawdata = fs.readFileSync('/mnt/d/Projects/HasoliditGrapher/res.json');
// cy.json(JSON.parse(rawdata));