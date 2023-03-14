const Users = require('../models/users');

const UserSeeder = () => {
    
    try {
        const fakeUsers = [
            {
                name: 'John Doe',
                email: 'john@gmail.com',
                password:'12345678'
            }
        ];

        fakeUsers.forEach(element => {
            Users.create(element).then((user) => {
                console.log('User created', user);
            }).catch((error) => {
                console.log(error);
            }
            );
        });
        
    } catch (error) {
        console.log(error);
    }
}



module.exports = { UserSeeder }