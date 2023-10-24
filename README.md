# IPFS-API

A commonJS API that allows you to store your files on ipfs and retrieve them from ipfs based on the CID.

In ESM we would use ipfs-core or helia but without dynamic importing, I want to do this in commonJS and use Helia and use dynamic imports.

# So here is how it should go


you have the first endpoint /upload

request body/Form-data file ->>

take the file, extract it's name, upload it to helia node, returns the CID
takes the CID add the pair (filename, CID) to the hash map 
resolve to your file has been added 


the second endpoint /retreive is like dis:

take the name of the file you want to retrieve from ipfs -don't forget the extension- ->> resolve the request with the content of the file. 







