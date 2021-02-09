// inspired from https://gist.github.com/bschwartz757/5d1ff425767fdc6baedb4e5d5a5135c8

const request = require('request');
const fs = require('fs');

const ENDPOINT_API_DEV = 'http://localhost:3001';
const ENDPOINT_API_PROD = 'https://projet89-backend.herokuapp.com';

const ENDPOINT_API = process.env.NODE_ENV === 'production'
    ? ENDPOINT_API_PROD
    : ENDPOINT_API_DEV;

const ENDPOINTS = [
    ENDPOINT_API + '/node',
    ENDPOINT_API + '/link',
    ENDPOINT_API + '/trail',
    ENDPOINT_API + '/trailbymemory',
];

// just used for tests
// const ENDPOINTS = [
//     'https://jsonplaceholder.typicode.com/posts',
//     'https://jsonplaceholder.typicode.com/albums',
//     'https://jsonplaceholder.typicode.com/users'
// ];

const requestAsync = function(url) {
    console.log('Fetching', url);
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
              console.error(error);
              process.exit(1);
              // return reject(err, response, body);
            }
            console.log(' - Fetching', url, ': done.');
            resolve(body);
            // resolve(JSON.parse(body));
        });
    });
};

const writeFile = (fileName, data) => {
  console.log('Writing file', fileName);
  fs.writeFile(fileName, data, error => {
      if (error) {
          console.error(error);
          process.exit(1);
      }
  });
  console.log(' - Writing file', fileName, ': done.');
} 

const writeFiles = (data) => {
  const [node, link, trail, trailbymemory] = data;
  writeFile('../../public/data/node.json', node);
  writeFile('../../public/data/link.json', link);
  writeFile('../../public/data/trail.json', trail);
  writeFile('../../public/data/trailbymemory.json', trailbymemory);
}

const fetchData = async () => {
    console.log('Fetching data');
    try {
        const data = await Promise.all(ENDPOINTS.map(requestAsync));
        writeFiles(data);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

}

fetchData();
