# IPFS-API

A commonJS API that allows you to store your files on IPFS and retrieve them from IPFS based on the filename.

In ESM we would use ipfs-core or helia but without dynamic importing, I want to do this in commonJS and use Helia and use dynamic imports.

# Run the server

```
npm install
npm start
```
# you have the first endpoint /upload

POST request body/Form-data file ->> spawn helia node 

take the file, extract it's name, upload it to helia node, returns the CID
takes the CID add the pair (filename, CID) to the hash map 
resolve to your file has been added 


# the second endpoint /retreive is like dis:

GET request body/raw/JSON, 
```
{
    "filename": "the_name_of_the_file_you_uploaded.extension"
}
```

take the name of the file you want to retrieve from ipfs -don't forget the extension- ->> spawn another helia node ->> resolve the request with the content of the file. 


# Questions

Why hashmaps ? well IPFS/Helia uses content addressing, there is no easy way to store the file with it's name and encodings, simply we just write the buffer and each buffer is under a CID, and I don't expect you to memorize the CID, i ALSO LOVE HASHMAPS </3


