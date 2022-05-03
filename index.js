const dotenv = require("dotenv");
const path = require("path");

const fs = require("fs");
const os = require('os')
dotenv.config({ path: path.resolve(__dirname, ".env") });

const {fork} = require('child_process')


const express = require("express");
const app = express();
app.listen(process.env.PORT || 3000, async () => {


    /*let ids = fs.readFileSync(
        path.resolve(__dirname, `./velas/${file}`),
        { encoding: "utf-8" }
      );
      ids = ids.split("\n");
        const childs = os.cpus().length;
       
      const denom = Math.ceil(ids.length/1);

      console.log(denom,'denom');*/
    //for (let i = 0; i < 1; i++) {
        //console.log(childs, 'childs');

        const bavc = fork('worker', [JSON.stringify({contract: '0x90CAB3687fF91Ef4399Da5f09F8ba020069C9979', file: 'BAVC.txt', timeout: 0})]);
        bavc.on('close', (code) => fork('worker', [JSON.stringify({contract: '0x90CAB3687fF91Ef4399Da5f09F8ba020069C9979', file: 'BAVC.txt', timeout: 0})]))

        const clowns = fork('worker', [JSON.stringify({contract: '0xbd529DD30C0D08DA42E737991E3B79E63f9CcCB8', file: 'VelasClowns.txt', timeout: .5})]);
        clowns.on('close', (code) => fork('worker', [JSON.stringify({contract: '0xbd529DD30C0D08DA42E737991E3B79E63f9CcCB8', file: 'VelasClowns.txt', timeout: 0})]))

        const bits = fork('worker', [JSON.stringify({contract: '0x7542E42A557C2684Adf0CAD5D511eA81a8188Bfb', file: 'DeadBits.txt', timeout: 1})]);
        bits.on('close', (code) => fork('worker', [JSON.stringify({contract: '0x7542E42A557C2684Adf0CAD5D511eA81a8188Bfb', file: 'DeadBits.txt', timeout: 0})]))

        const picasso = fork('worker', [JSON.stringify({contract: '0x6924f5B55cd76d32a6ED96d3Ecd9dd1C7E54a7ca', file: 'VelasPicassoApes.txt', timeout: 1.5})]);
        picasso.on('close', (code) => fork('worker', [JSON.stringify({contract: '0x6924f5B55cd76d32a6ED96d3Ecd9dd1C7E54a7ca', file: 'VelasPicassoApes.txt', timeout: 0})]))

       

      



       // fork('worker', [JSON.stringify({contract: '0xb73cc6d7a621e0e220b369c319dbfac258cef4d2', file: 'VelasOGPunks.txt', timeout: 1})]);
    //fork('worker', [JSON.stringify({contract, file, from: 0, to: 1000})]);
    //fork('worker', [JSON.stringify({contract, file, from: 1001, to: 2000})]);
    //fork('worker', [JSON.stringify({contract, file, from : 2001, to: 3000})]);
   // w1.addListener('close', (code) => console.log('stoped,', code));
    //fork('worker', [JSON.stringify({contract: '0x7542E42A557C2684Adf0CAD5D511eA81a8188Bfb', file: 'DeadBits.txt'})])
});
