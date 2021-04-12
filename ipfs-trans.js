const fs = require('fs');
const IPFS = require('ipfs');
const uint8ArrayConcat = require('uint8arrays/concat')
const CID = require('cids')

function delayPromise (milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
var IPFSXfer = {
  node :{},
  version: {},
  start : async () => {
	  node = await IPFS.create();
/*	  
 	  node = await IPFS.create(
	{
  libp2p: {
    config: {
      dht: {
        enabled: true,
        clientMode: true
      }
    }
  },
	config: {
	Addresses: {
		Swarm: [
			'/ip4/0.0.0.0/tcp/4001',
			//'/ip6/::/tcp/4001'
			],
		//API: '/ip4/0.0.0.0/tcp/5001',
		//Gateway: '/ip4/127.0.0.1/tcp/8080'
	},
	Bootstrap:     
	[
	//'/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
	//'/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
	//'/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
	//'/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
	//'/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
	//'/ip4/104.131.131.82/udp/4001/quic/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ'
	],
  	relay: {
    	enabled: true,
    	hop: {
      		enabled: true,
		active: true
    	}}
	}});
*/
	version = await node.version();
	nodeId = await node.id();
	console.log('Version:', version.version);
	console.log('ID:', nodeId);

	var cron = require('cron');
	var cronJob = cron.job("0 0 * * * *", function(){
			node.id()
			.then(peerInfo => console.log('My addresses are:', peerInfo.addresses))
			.then(() => console.log('Waiting for some peers...'))
			//.then(() => delayPromise(15 * 1000))
			.then(() => node.swarm.peers())
			.then(peers => peers.map(peer => peer.addr.toString()))
			.then(peers => console.log('Peers I am connected to:', peers))
			.catch(error => console.error('UHOH:', error));
			}); 
	cronJob.start();
  },

  download : async (hash) =>
    {
      var savedFilePath = '/tmp/' + hash;
      if (!fs.existsSync(savedFilePath)) {
	const chunks = []
          for await (const chunk of node.cat(hash)) {
            chunks.push(chunk)
         }

        fs.writeFileSync(savedFilePath, uint8ArrayConcat(chunks), {encoding: null});
      }

	//const providers = node.dht.findProvs(new CID(hash));
	//for await (const provider of providers) {
	//  console.log(provider.id.toString());
	//}
      return savedFilePath;
    },

  upload : async(path) =>
    {
      let testFile = fs.readFileSync(path);
      let testBuffer = Buffer.from(testFile);
      const filesAdded = await node.add(testBuffer, {pin: false});
      const hash = filesAdded.cid.toString();
      node.pin.add(hash, {recursive: false});
      console.log('Added file:', filesAdded.path, hash);

      return hash;
    },
  unpin: async(hash) =>
    {
      await node.pin.rm(hash);
    }
};

module.exports = IPFSXfer;