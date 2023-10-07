import fs from "fs"
import jwt from "jsonwebtoken"
import crypto, {generateKeyPairSync, randomBytes,  } from "crypto"
import process from "process";


/**
 * @name generateRSAKeyPair
 * @description generate new RSA Key pair
 * @returns {privateKey: string, publicKey: string} keys
 */
export function generateRSAKeyPair(){
        
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            format: 'pem',
            type: "spki"
        },
        privateKeyEncoding: {
            format: 'pem',
            type: 'pkcs8'
        }
    })

    return {
        privateKey, 
        publicKey
    }
    
}


/**
 * @name generateKeyPairAndWriteToDisk
 * @description generate key pair and store in disk 
 * TODO: update functionality to fetch from a secret manager instead
 * @returns 
 */
export function generateKeyPairAndWriteToDisk(){ // or pull in from key manager

    const { privateKey, publicKey } = generateRSAKeyPair()
    
    let folder_name = `KEYS`

    let file_exists = fs.existsSync("./KEYS")

    if(file_exists){
        fs.writeFileSync(`${folder_name}/private.pem`, privateKey, "utf8");
        fs.writeFileSync(`${folder_name}/public.pem`, publicKey, "utf8"); // to be served on the well known endpoint 
        return;
    }
    
    fs.mkdirSync("./KEYS") 
    fs.writeFileSync(`${folder_name}/private.pem`, privateKey, "utf8");
    fs.writeFileSync(`${folder_name}/public.pem`, publicKey, "utf8"); // to be served on the well known endpont
}



/**
 * @name generateEncryptionKey
 * @description generate a 16 hex code encrption key and save it to the same directory as keys 
 * TODO: update functionality to get keys from a secrets manager instead
 */
export function generateEncryptionKey(){

    const key = randomBytes(16).toString("hex")

    let file_exists = fs.existsSync("./KEYS/encryption_key.txt")

    if(file_exists){
        throw new Error("File Already exists")
    }

    fs.writeFileSync(`./KEYS/encryption_key.txt`, key, "utf8");
}



/**
 * !!! IMPORTANT - needs to be called early 
 * @name getRSAKeyPair 
 * @description gets the rsa key pair and encryption key and stores them as env variables
 */
export function getRSAKeyPair(){

    let file_exists = fs.existsSync("./KEYS")

    if(!file_exists) throw new Error("KEYS ARE NOT PROVIDED")


    const private_key = fs.readFileSync(`./KEYS/private.pem`, "utf8")
    const public_key = fs.readFileSync("./KEYS/public.pem", "utf-8")
    const encryption_key = fs.readFileSync("./KEYS/encryption_key.txt", "utf-8");

    process.env.PRIVATE_KEY = private_key
    process.env.PUBLIC_KEY = public_key 
    process.env.ENCRYPTION_KEY = encryption_key
    
}


/**
 * @name encryptToken
 * @description encrypt token
 * @param token 
 * @returns 
 */
export function encryptToken(token: string) {
    
    if(!process.env.ENCRYPTION_KEY){
        throw new Error("No Encryption Key has been set") 
    }

    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf-8')
    const iv = Buffer.alloc(16)


    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encryptedToken = cipher.update(token, 'utf-8', 'hex')
    encryptedToken += cipher.final('hex')

    return encryptedToken 
}


/**
 * @name decryptToken
 * @description decrypt encrypted token
 * @param encrypted_token 
 * @returns 
 */
export function decryptToken(encrypted_token: string)
{
    if(!process.env.ENCRYPTION_KEY){
        throw new Error("No encryption key has been set")
    }

    const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf-8")

    const iv = Buffer.alloc(16)

    const decipher =  crypto.createDecipheriv('aes-256-cbc', key, iv)

    let decryptedToken = decipher.update(encrypted_token, 'utf-8', 'hex')
    decryptedToken += decipher.final('hex');

    return decryptedToken
}



/**
 * @name createJWT 
 * @description - wrapper function around ```ts jwt.sign`` passes in the PRIVATE_KEY
 * @param payload 
 * @param options 
 * @returns 
 */
export function createJWT(payload: jwt.JwtPayload, options?: jwt.SignOptions)
{
    if(!process.env.PRIVATE_KEY){
        throw new Error("PRIVATE KEY NOT PROVIDED")
    }
    const token = jwt.sign(payload, process.env.PRIVATE_KEY, options)

    return token;
}


export function validateJWT<T= jwt.JwtPayload >(token: string):T{

    if(!process.env.PUBLIC_KEY){
        throw new Error("PUBLIC KEY NOT PROVIDED")
    }


     return jwt.verify(token, process.env.PUBLIC_KEY) as any
}



