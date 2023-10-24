const express = require('express');
const FS = require('fs');


const multer = require("multer");
const express = require('express')
const app = express();
const upload = multer()

let hashMap = new Map();

app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
    try{
    const data = req.file.buffer

    console.log(req.file) //we don't need this but it might be useful to have this data to reconstruct the file 
    //spawn helia node 
    const { createHelia } = await import('helia')
    const { unixfs } = await import('@helia/unixfs')
  
    // create a Helia node
    const helia = await createHelia()

    // print out our node's PeerId
    console.log(helia.libp2p.peerId)

    const fs = unixfs(helia)
    const cid = await fs.addBytes(data)
    hashMap.set(req.file.originalname, cid)
    res.status(201).send( `File uploaded to ipfs and CID has been stored., ${cid}`)}
    
    catch(error){
        res.send('sorry we couldnt upload the file to ipfs')
    }
  });

app.get('/retreive', async (req, res)=>{
    const { createHelia } = await import('helia')
    const helia = await createHelia()
    const { unixfs } = await import('@helia/unixfs')
    const fs = unixfs(helia)
    
   
    const filename = req.body.originalname;
    let cid;
    let text;

    try {
        cid = hashMap.get(filename)
        console.log("Shine on you crazy diamond",cid)
        if (!cid){
            console.error('oops we could not find the cid, make sure you upload the file to IPFS first')
        }
        const decoder = new TextDecoder() // decode uint arrays into strings
        
   
         for await (const chunk of fs.cat(cid)) {
                text = decoder.decode(chunk, {stream: true});
                console.log("je marche dans la tempete", text)
       
    }
        res.status(200).send(text)
    } catch (error){
        res.send('well you up messed somewhere, make sure you upload the file')
        
    } 
})


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));  