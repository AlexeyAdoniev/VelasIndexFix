const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const drift = require("./drift");
const web3 = require("web3");
const fs = require("fs");
dotenv.config({ path: path.resolve(__dirname, ".env") });

const args = JSON.parse(process.argv[2]);

const timeout = args.timeout;


const schema = new mongoose.Schema({
  chainId: "string",
  tokenId: "string",
  owner: "string",
  contract: "string",
  uri: "string",
  name: "string",
  contractType: "string",
  symbol: "string",
});
const Tank = mongoose.model("eth-nft-dto", schema, "eth-nft-dto");

mongoose.connect(process.env["MONGO_URL"], (err) => {
  console.log(err);
});

const Web3 = new web3(process.env['VELAS_NODE']);


const contractAddr = args.contract.toLowerCase();
const file  = args.file;

  let ids = fs.readFileSync(
    path.resolve(__dirname, `./velas/${file}`),
    { encoding: "utf-8" }
  );

 
  
  ids = ids.split("\n");

  ids = ids.map((id) => {
    const data = id.split(":-:");
    return {
      id: data[0],
      owner: data[1],
    };
  });

  const contract = new Web3.eth.Contract(
    drift,
    contractAddr
  );

 



  async function cycle(ids, start, end, docs, name, symbol) {

   
    
         

    for (let i = start; i < end; i++) {
        const item = ids[i];
        if (item) {
            try {
                let [owner, uri] = await Promise.allSettled([
                    (async () => {
                        return await contract.methods.ownerOf(item.id).call();
                      })(),

                    (async () => {
                        return await contract.methods.tokenURI(item.id).call();
                    })(),
                    
               
            
                ]).catch((e) => console.log(e))
        
                if (
                   owner.status === "fulfilled"
                ) {

                    const toDelete = docs.filter(doc => String(doc.tokenId) === String(item.id));
            
                    await Tank.deleteMany({_id:{$in:toDelete.map(d => d._id)}})

                    await new Tank({
                    name: name,
                    symbol: symbol,
                    tokenId: item.id.toString(),
                    owner: owner.value.toString(),
                    chainId: "19",
                    contractType: "ERC721",
                    uri: uri.value?  uri.value: toDelete.find(d => d.uri)?.uri,
                    contract: contractAddr.toLowerCase(),
                  }).save();

                } else {
                    //console.log(owner, 'error');
                }
              } catch (err) {
                //console.log(err?.message, 'here');
              }
        }
     
      }

   
  }



setTimeout(async () => {


  const p = async () => {

    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();

   
    const docs = await Tank.find({
        // tokenId: item.id,
         chainId: "19",
         contract: contractAddr
       })
                                                                                              
    
    const tasksNum = 50;
    const denominator = Math.ceil(ids.length/tasksNum);
    const tasks = new Array(tasksNum).fill(1).map((task, i) => {

        if (i * denominator > ids.length) return;

        if ((i+1) * denominator > ids.length) return cycle(ids, i * denominator, ids.length, docs, name, symbol);

        return cycle(ids, i * denominator, (i+1) * denominator, docs, name, symbol);
    })
   
    const tm = Date.now();

    Promise.all(tasks).then(() => {

        console.log('finito ', file, `,time - ${(Date.now() - tm)/1000/60}`);
        setTimeout(() => p())
    })

  
  
  };


  

  setTimeout(() => p())
}, (timeout + Math.random()) * 1000);




