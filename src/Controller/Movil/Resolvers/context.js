const jwt = require('jsonwebtoken');
require('dotenv').config({path:'.env'})

const context = ({req}) => {

    const token = req.headers['authorization'] || '';
    if(token){
        try{
            const usuarios = jwt.verify(token, process.env.SECRETA);
            return {usuarios}
        }catch(error){
            console.log('el error de verficacion del token es: ',error)
        }
    }
}

module.exports = context