const express = require("express")
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.AWS_RDS_DB, process.env.AWS_RDS_USERNAME, process.env.AWS_RDS_PASSWORD, {
    host: process.env.AWS_RDS_HOST,
    dialect: 'postgres'
});
const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false

    }

}
);

const app = express();
app.use(express.json())

app.use("/",(req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers","*")
    next();
})

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'User Service is running fine' })
})


app.post('/register', async (req, res) => {

    const { firstName, lastName, email } = req.body;
    console.log(req.body)
    try {
        const user = await User.create({ firstName, lastName, email });
        if (user) {

            return res.status(201).json({ message: 'User created' })
        }
        return res.status(400).json({ error: 'Bad Request' })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Server Internal Error' })
    }

})


const port = process.env.PORT || 4000;
app.listen(port, async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log(`User Management Service is running on port ${port}`)
})