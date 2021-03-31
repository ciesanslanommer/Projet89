// inspired from https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8

const request = require('request');
const fs = require('fs');

const ENDPOINT_API_DEV = 'http://localhost:3001';
const ENDPOINT_API_PROD = 'https://projet89-backend.herokuapp.com';

// const ENDPOINT_API =
//   process.env.NODE_ENV === 'production' ? ENDPOINT_API_PROD : ENDPOINT_API_DEV;

const ENDPOINT_API = ENDPOINT_API_PROD;

const ENDPOINTS = [
  ENDPOINT_API + '/node',
  ENDPOINT_API + '/link',
  ENDPOINT_API + '/trail',
  ENDPOINT_API + '/trailbymemory',
  ENDPOINT_API + '/memories',
];

// // just used for tests
// const ENDPOINTS = [
//     'https://jsonplaceholder.typicode.com/posts',
//     'https://jsonplaceholder.typicode.com/albums',
//     'https://jsonplaceholder.typicode.com/users',
//     'https://jsonplaceholder.typicode.com/users',
//     'https://jsonplaceholder.typicode.com/users',
// ];

const [,, argpath] = process.argv;
const path = argpath || '../../public/data';

const requestAsync = function (url) {
  console.log('Fetching', url);
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        console.error(error);
        process.exit(1);
        // return reject(err, response, body);
      }
      console.log(' - Fetching', url, ': done.');
      resolve(JSON.parse(body));
    });
  });
};

const writeFile = (fileName, data) => {
  console.log('Writing file', fileName);
  fs.writeFile(fileName, data, (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });
  console.log(' - Writing file', fileName, ': done.');
};

const writeFiles = (data) => {
  // remove and recreate memory/ folder
  fs.rmdirSync(`${path}/memory/`, { recursive: true });
  fs.mkdirSync(`${path}/memory/`);
  // fetch all data
  const [node, link, trail, trailbymemory, memories] = data;
  // write data on static json files
  writeFile(`${path}/node.json`, JSON.stringify(node, 0, 4));
  writeFile(`${path}/link.json`, JSON.stringify(link, 0, 4));
  writeFile(`${path}/trail.json`, JSON.stringify(trail, 0, 4));
  writeFile(`${path}/trailbymemory.json`, JSON.stringify(trailbymemory, 0, 4));
  memories.forEach(memory => writeFile(`${path}/memory/${memory.id}.json`, JSON.stringify(memory, 0, 4)));
};

const fetchData = async () => {
  console.log('Fetching data');
  try {
    const data = await Promise.all(ENDPOINTS.map(requestAsync));
    writeFiles(data);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fetchData();
