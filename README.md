# nextel-challenge

This is a sample solution for Nextel's hiring challenge.

## Getting Started

### Prerequisites

- Node.js 8.9.4 or higher
- NPM 5.7.1 or higher
- [Postgres](https://www.postgresql.org/download/) database 9.6 or higher with [Postgis](https://postgis.net/install/) extension
- Git

### Instalation

- Clone this project using the command below inside your terminal

```
git clone https://github.com/adalbertorsilva/nextel-challenge.git
```

-  Enter the folder

```
cd nextel-challenge/
```

- Create a .env file on root directory and set an TOKEN_SECRET variable on it ( there is a .env-example in this project to help with any trouble)

- Go to **/config** folder with **cd /config** and create an config.json file with your database configurations as below

```
{
  "development": {
    "username": "postgres",
    "password": "junior",
    "database": "database_dev",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  }
}
```
(there is a config-example.json in this project to help with any trouble)

- Inside your terminal run the command to build the application

```
npm run build
```

- Start the application running the command

```
npm start
```

The app will start on port 8000 and will seed and user with **username "root" and password "root"**

### Running Tests

- To run automated tests use the command

```
npm test
```

### Test Coverage

- After each test running it will show up a succinct coverage summary.

```
=============================== Coverage summary ===============================
Statements   : 99.69% ( 326/327 )
Branches     : 91.84% ( 45/49 )
Functions    : 100% ( 94/94 )
Lines        : 99.69% ( 317/318 )
================================================================================
```
- If you want to see a more detailed report, after each test execution a **coverage folder** is created / updated and inside of it there is an **index.html** file that has more detailed apresentation

