const dotenv = require("dotenv");
const path = require("path");
const os = require("os")
dotenv.config({ path: path.resolve(__dirname, ".env") });

const {fork} = require('child_process')


const express = require("express");
const req = require("express/lib/request");
const app = express();
app.listen(process.env.PORT || 3000, async () => {

        console.log(os.cpus().length);

        const vns = fork('worker', [JSON.stringify({contract: '0xc9e2af6d4EfEa2BDDC2e836F79272b367fAD1712', file: 'Velas Name Service.txt', timeout: 2.5})]);
        vns.on('close', (code) => fork('worker', [JSON.stringify({contract: '0xc9e2af6d4EfEa2BDDC2e836F79272b367fAD1712', file: 'Velas Name Service.txt', timeout: 0})]))

        const ogapes = fork('worker', [JSON.stringify({contract: '0xa6928F75594650e3C6237C209d221905bD714495', file: 'VelasOGApes.txt', timeout: 2})]);
        ogapes.on('close', (code) => fork('worker', [JSON.stringify({contract: '0xa6928F75594650e3C6237C209d221905bD714495', file: 'VelasOGApes.txt', timeout: 0})]))

        const bavc = fork('worker', [JSON.stringify({contract: '0x90CAB3687fF91Ef4399Da5f09F8ba020069C9979', file: 'BAVC.txt', timeout: 0})]);
        bavc.on('close', (code) => fork('worker', [JSON.stringify({contract: '0x90CAB3687fF91Ef4399Da5f09F8ba020069C9979', file: 'BAVC.txt', timeout: 0})]))

        const clowns = fork('worker', [JSON.stringify({contract: '0xbd529DD30C0D08DA42E737991E3B79E63f9CcCB8', file: 'VelasClowns.txt', timeout: .5})]);
        clowns.on('close', (code) => fork('worker', [JSON.stringify({contract: '0xbd529DD30C0D08DA42E737991E3B79E63f9CcCB8', file: 'VelasClowns.txt', timeout: 0})]))

        const bits = fork('worker', [JSON.stringify({contract: '0x7542E42A557C2684Adf0CAD5D511eA81a8188Bfb', file: 'DeadBits.txt', timeout: 1})]);
        bits.on('close', (code) => fork('worker', [JSON.stringify({contract: '0x7542E42A557C2684Adf0CAD5D511eA81a8188Bfb', file: 'DeadBits.txt', timeout: 0})]))

        const picasso = fork('worker', [JSON.stringify({contract: '0x6924f5B55cd76d32a6ED96d3Ecd9dd1C7E54a7ca', file: 'VelasPicassoApes.txt', timeout: 1.5})]);
        picasso.on('close', (code) => fork('worker', [JSON.stringify({contract: '0x6924f5B55cd76d32a6ED96d3Ecd9dd1C7E54a7ca', file: 'VelasPicassoApes.txt', timeout: 0})]))

});
