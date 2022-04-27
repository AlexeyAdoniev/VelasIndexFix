

const dotenv = require("dotenv");
const path = require("path")
const mongoose = require('mongoose')
const drift = require('./drift')
const web3 = require('web3')
dotenv.config({ path: path.resolve(__dirname, '.env') });



console.log(process.env);
const Web3 = new web3(process.env['XDAI_NODE']);


const schema = new mongoose.Schema({ 
    chainId: 'string',
    tokenId: 'string',
    owner: 'string',
    contract: 'string',
    uri: 'string' ,
    name: 'string' ,
    contractType: 'string',
    symbol: 'string' 
    });
const Tank = mongoose.model('eth-nft-dto', schema, 'eth-nft-dto');

mongoose.connect(process.env['MONGO_URL'], (err) => {
    console.log(err)
    
})


const express = require('express');
const app = express();
app.listen(process.env.PORT || 3000, () => {

    const p = async () => {
        const arr = new Array(200).fill(0).map((n,i) => i)
        console.log(arr)
        const contract = new Web3.eth.Contract(drift, process.env['CONTRACT'])
        for await(let i of arr) { 
            console.log(i)
            try {
                const p = await contract.methods.ownerOf(i).call()
                const uri = await contract.methods.tokenURI(i).call()
                const y = await Tank.find({ tokenId: i, chainId: '14', contract: process.env['CONTRACT'] }).exec().then(r => r)
                console.log(y, 'hello')
                for await(let p of y) {
                    console.log(p)
                    await Tank.deleteOne({ _id: p._id }).exec().then(r => r)
                }
                console.log(p)
                const asd = await new Tank({ 
                    name: 'WrappedSNAFU',
                    symbol: 'WSNAFU',
                    tokenId: `${i}`,
                    owner: p,
                    chainId: '14',
                    contractType: 'ERC721',
                    uri,
                    contract: process.env['CONTRACT']
                 }).save()
                 console.log(asd)
            } catch(err) {
                console.log(err?.message)
            }

        }
    
    }
    setInterval(() => {
        p()
    }, 10000)
});
