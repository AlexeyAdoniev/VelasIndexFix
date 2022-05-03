const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const drift = require("./drift");
const web3 = require("web3");
const fs = require("fs");
dotenv.config({ path: path.resolve(__dirname, ".env") });
const { vlxToEth, ethToVlx } = require("./address");

const args = JSON.parse(process.argv[2]);

const timeout = args.timeout;

console.log(timeout);

setTimeout(async () => {

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

    
const args = JSON.parse(process.argv[2]);

const contractAddr = args.contract.toLowerCase();
const file  = args.file;

  let ids = fs.readFileSync(
    path.resolve(__dirname, `./velas/${file}`),
    { encoding: "utf-8" }
  );
  
  const from  = args.from;
  const to  = args.to? args.to: ids.length - 1;
  
  ids = ids.split("\n").slice(from, to);

  ids = ids.map((id) => {
    const data = id.split(":-:");
    return {
      id: data[0],
      owner: data[1],
    };
  });

  async function cycle(ids, start, end, docs) {

    const contract = new Web3.eth.Contract(
        drift,
        contractAddr
      );
  

    const newDocs = [];

         

    for (let i = start; i < end; i++) {
        const item = ids[i];
        if (item) {
            try {
                let [owner, name, symbol, uri] = await Promise.allSettled([
                    (async () => {
                        return await contract.methods.ownerOf(item.id).call();
                      })(),

                    (async () => {
                        return await contract.methods.name().call();
                    })(),
        
                    (async () => {
                        return await contract.methods.symbol().call();
                    })(),
        
                    (async () => {
                        return await contract.methods.tokenURI(item.id).call();
                    })(),
                    
               
            
                ]).catch((e) => console.log(e))
        
                if (
                   owner.status === "fulfilled" && 
                  name.status === "fulfilled" &&
                  symbol.status === "fulfilled" &&
                  uri.status === "fulfilled" 
                  
                ) {

                    const toDelete = docs.filter(doc => String(doc.tokenId) === String(item.id));
            
                    await  Tank.deleteMany({_id:{$in:toDelete.map(d => d._id)}})

                    if (owner.value === '0x6449b68cc5675f6011e8DB681B142773A3157cb9') {
                        console.log(owner.value);
                    }

                  newDocs.push(new Tank({
                    name: name.value,
                    symbol: symbol.value,
                    tokenId: item.id.toString(),
                    owner: owner.value.toString(),
                    chainId: "19",
                    contractType: "ERC721",
                    uri: uri.value,
                    contract: contractAddr.toLowerCase(),
                  }))

                } else {
                    console.log(owner, 'error');
                }
              } catch (err) {
                console.log(err?.message, 'here');
              }
        }
     
      }

      await Tank.insertMany(newDocs)
  }

  const p = async () => {
    //const arr = new Array(200).fill(0).map((n,i) => i)




    const docs = await Tank.find({
        // tokenId: item.id,
         chainId: "19",
         contract: contractAddr
       })
                                                                                              

    const tasksNum = 10;
    const denominator = Math.ceil(ids.length/tasksNum);
    const tasks = new Array(tasksNum).fill(1).map((task, i) => {

        if (i * denominator > ids.length) return;

        if ((i+1) * denominator > ids.length) return cycle(ids, i * denominator, ids.length, docs);

        return cycle(ids, i * denominator, (i+1) * denominator, docs);
    })
   
    const tm = Date.now();

    Promise.all(tasks).then(() => {

        console.log('finito ', file, `,time - ${(Date.now() - tm)/1000/60}`);

    })

  
  
  };


  

  p();
}, (timeout + Math.random()) * 1000);




