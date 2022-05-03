const dotenv = require("dotenv");
const path = require("path");

const fs = require("fs");
const os = require('os')
dotenv.config({ path: path.resolve(__dirname, ".env") });

const {fork} = require('child_process')


const express = require("express");
const app = express();
app.listen(process.env.PORT || 3000, async () => {

    const contract = '0x948E8c6E0c9035f7372a10e10f9f71cC81341053';
    const file = 'VelasPunks.txt'

    let ids = fs.readFileSync(
        path.resolve(__dirname, `./velas/${file}`),
        { encoding: "utf-8" }
      );
      ids = ids.split("\n");
        const childs = os.cpus().length;
       
      const denom = Math.ceil(ids.length/childs);

      console.log(denom,'denom');
    for (let i = 0; i < childs; i++) {
        console.log(childs, 'childs');
        fork('worker', [JSON.stringify({contract, file, timeout: i, from: i * denom, to: (i + 1) * denom})]);
    }   
    //fork('worker', [JSON.stringify({contract, file, from: 0, to: 1000})]);
    //fork('worker', [JSON.stringify({contract, file, from: 1001, to: 2000})]);
    //fork('worker', [JSON.stringify({contract, file, from : 2001, to: 3000})]);
   // w1.addListener('close', (code) => console.log('stoped,', code));
    //fork('worker', [JSON.stringify({contract: '0x7542E42A557C2684Adf0CAD5D511eA81a8188Bfb', file: 'DeadBits.txt'})])
});
