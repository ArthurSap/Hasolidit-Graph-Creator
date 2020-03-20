# Hasolidit graph creator

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

Almost evrything is hard coded, in a quick and dirty way.
Given an initial link (hard coded) from Hasolidit blog, go through the follow up links from the intiail link and create a graph where each vertex is a post and each (directed) edge symbolizes which post lead to whom.
Currently, external sites are not supported.

## Getting Started <a name = "getting_started"></a>

1. `git pull`
2. `npm install`
3. Open `index.html` and choose `res.json` as the file.

## Prerequisites
(Only if you want a new graph from a different node or for development).
* Node.js
* MongoDB
* npm
* Create a db with a collection as defined in `db.json`

## Usage <a name = "usage"></a>

If you want the graph to start from a different post run `npm install`. Make sure you have `mongodb` installed and that a `mongod` process is running.
Change the `initialLink` in `graphCreator.js` to be whatever you want, and run the file via `node graphCreator.js`.
This will generate a new `res.json` you can use. Do note you need to change the initial link in `index.js` too.
If you want to change the layout of the graph simply change it in `index.js` at
```
document.getElementById('cy').addEventListener('dataavailable', function(e) { /* your new layout goes here */ }
```

## Known issues
External sites are not supported (no vertex will be created).
Clicking on an edge will change focus at most twice and then it will stay on the target of the edge.
Clicking on an edge will color the source's edge accordingly but will never un-color them.
"Random" button doesn't work.
Generating the `res.json` is completly independant from presenting it.
Code looks ugly.