import jwt from "jsonwebtoken"

//In JWT authorization, when the user signin it will create a token and user have to use that token in header part for different requests.
const jwtAuth = (req, res, next) => {
    //1.Read the token 
    const token = req.headers['authorization']

    //2.if no token, return the error
    if(!token) {
        return res.status(401).send('Unauthorized')
    }

    //3.check if token valid
    try{
        const payload = jwt.verify(token, 'ry]CuLW_QN=Q|8w242X[HJZfV=vJ~8')
        req.userID = payload.userID // Here we are attaching userID from payload to req body, so that we can use it in cartItems controller and it is most secured way to retrive userID
    }catch(err) {
        //4.return error
        return res.status(401).send('Unauthorized error')
    }

    //5.call next middleware
    next()
}

export default jwtAuth