const express = require('express');
const multer = require("multer");
const app = express();
const upload = multer()

let hashMap = new Map();

app.use(express.json());

//node spawner with filesystem
async function createNode(){
    const { createHelia } = await import('helia')
    const helia = await createHelia()
    const { unixfs } = await import('@helia/unixfs')
    const fs = unixfs(helia)
    return fs
}
app.post('/upload', upload.single('file'), async (req, res) => {
    try{
    const data = req.file.buffer

    console.log(req.file) //we don't need this but it might be useful to have this data to reconstruct the file 
    //spawn helia node 
    const fs = await createNode();
    
    const cid = await fs.addBytes(data)
    hashMap.set(req.file.originalname, cid)
    res.status(201).send( `File uploaded to ipfs and CID has been stored., ${cid}`)}
    
    catch(error){
        res.send('sorry we couldnt upload the file to ipfs')
    }
  });

app.get('/retreive', async (req, res)=>{
    //spawn helia node
    
    const fs = await createNode();
   
    const filename = req.body.filename;
    let cid;
    let text;

    try {
        cid = hashMap.get(filename)
        console.log("Shine on you crazy diamond",cid)
        if (!cid){
            console.error('oops we could not find the cid, make sure you upload the file to IPFS first')
        }
        // decode uint arrays into strings
        const decoder = new TextDecoder() 
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