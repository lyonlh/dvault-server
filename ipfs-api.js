// const ipfsAPI = require('ipfs-http-client');
const fs = require('fs');
// // const ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// const ipfs = ipfsAPI({ host: 'gateway.ipfs.io', port: 443, protocol: 'https' });
// //const ipfs = ipfsAPI({ host: 'dweb.link', port: 5001, protocol: 'https' });

let testFile = fs.readFileSync("./example.json");
let testBuffer = Buffer.from(testFile);
// ipfs.add(testBuffer, function (err, res) {
//     if (err || !res) {
//       return console.error('ipfs add error', err, res)
//     }

//     res.forEach(function (file) {
//       if (file && file.hash) {
//         console.log('successfully stored', file.hash)
//         //display(file.hash)
//       }
//     })
//       })
/*
const func = async () => {
const data = await ipfs.add('test');
console.log('end');
console.log(data);
}

func()
*/


const IPFS = require('ipfs')

async function main () {
  const node = await IPFS.create()
  const version = await node.version()

  console.log('Version:', version.version)

  // const filesAdded = await node.add({
  //   path: 'hello.txt',
  //   content: 'Hello World 101'
  // })

  const filesAdded = await node.add(testBuffer)

  console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)

  const fileBuffer = await node.cat(filesAdded[0].hash)

  console.log('Added file contents:', fileBuffer.toString())
}

main()
