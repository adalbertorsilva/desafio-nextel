const app = require('../app')

const PORT = parseInt(process.env.PORT, 10) || 8000
app.set('port', PORT)

app.listen(PORT)

console.log(`-------------------------------------  Server up on port ${PORT} -------------------------------------`)