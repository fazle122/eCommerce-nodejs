import bcrypt from 'bcryptjs';


const users = [
    {
        name:'Fazle Rabby',
        email:'fazlerabby122@gmail.com',
        password: bcrypt.hashSync('admin1234',10),
        isAdmin:true,
    },
    {
        name:'Mehedi Hasan',
        email:'fazlerabby4466@gmail.com',
        password: bcrypt.hashSync('mehedi1234',10),
        isAdmin:false,
    },
    {
        name:'Hanif Ahmed',
        email:'ideaxentestemail@gmail.com',
        password: bcrypt.hashSync('hanif1234',10),
        isAdmin:false,
    }
]

export default users;