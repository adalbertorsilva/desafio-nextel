const User = require('./models').User

beforeAll(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await clearDatabase()
})

const clearDatabase = async () => {
  await User.destroy({where: {}})
}
