import { generateKeyPairSync, randomBytes } from "crypto"
import fs from "fs"



(()=>{

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    })


    const keys_dir_exists = fs.existsSync("./keys")

    


    if(!keys_dir_exists) fs.mkdirSync("./keys")
    
    fs.writeFileSync("./keys/publicKey.pem", publicKey)
    fs.writeFileSync("./keys/privateKey.pem", privateKey)
    console.log(":::::::::::::::::DONE GENERATING SYMMETRIC KEYS:::::::::")

    const secretKey = randomBytes(32).toString('base64')

    fs.writeFileSync("./keys/secretKey.txt", secretKey)
    return


})()