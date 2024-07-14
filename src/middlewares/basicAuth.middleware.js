import UserModel from "../features/user/user.model.js"

const basicAuthorizer = (req, res, next) => {
    // 1. check if authorization header is sempty
    const authHeader = req.headers["authorization"]//we can access headers for req object i.e. headers , we can send multiple headers to client and headers is an array but here we want authorization header 

    if(!authHeader) {
        return res.status(401).send("No authorization details found")//401 status code means unauthorized person
    }
    console.log(authHeader)

    // 2. If there are authorization details then we have to extract those details and verify if creds are correct or not
    // the details send form server and received from client , they will be in base64 encoding and we need to decode them
    const base64Credentials  = authHeader.replace('Basic ','');
    console.log(base64Credentials)

    // 3. decode credentials
    const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf8')
    console.log(decodedCreds) //this will print [username:password]

    const creds = decodedCreds.split(':')

    const user = UserModel.getAll().find((u) => u.email == creds[0] && u.password == creds[1])

    if(user) {
        next()
    }
    else {
        return res.status(401).send("Invalid credentials")
    }
}

export default basicAuthorizer;