const fs = require('fs');

let testFile = fs.readFileSync("./example.json");
let testBuffer = Buffer.from(testFile);

const IPFS = require('ipfs')

async function main () {
  const node = await IPFS.create()
  const version = await node.version()

  console.log('Version:', version.version)

  const filesAdded = await node.add(testBuffer)

  console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)

  const fileBuffer = await node.cat(filesAdded[0].hash)

  console.log('Added file contents:', fileBuffer.toString())
}

main()
