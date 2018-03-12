const User = require('../../models').User

describe('User', () => {
  describe('Test user hash generation', () => {
    it('Must generate a hash for the user', () =>{

        const password = 'supersecret' 

        const user = new User()
        user.username = 'John Doe'
        user.password = password
        user.generatePasswordHash()

        expect(user.password).not.toBe(password)
    })

    it('Must decrypt and validate the password for the user', () =>{

        const password = 'supersecret' 

        const user = new User()
        user.username = 'John Doe'
        user.password = password
        user.generatePasswordHash()

        expect(user.validatePassword(password)).toBeTruthy()
    })
  })
})