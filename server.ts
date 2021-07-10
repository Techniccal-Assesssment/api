import express, { Application, Request, Response } from "express";
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app: Application = express();
const port = 3500;
const users = require('./data/Users');

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

app.get(
    "/",
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "API works",
        });
    }
);

//get all users from JSON file
app.get(
    "/users",
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Success!",
            data: users
        });
    }
);

//get User object by id
app.get(
    "/users/:id",
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Success!",
            data: req.params.id !== undefined ? users.filter(function (obj: any) {
                return obj.id == req.params.id
            }) : 'User not exist'
        })
    }
)

//save the user in the json file
app.post(
    "/users",
    async (req: Request, res: Response) => {

        try {
            const newUser = req.body;
            const data = fs.readFileSync(path.resolve(__dirname, './data/Users.json'));
            const users = JSON.parse(data);
            users.push(newUser);
            fs.writeFileSync(path.resolve(__dirname, './data/Users.json'), JSON.stringify(users))

            return res.status(200).send({
                message: 'success'
            })

        } catch (ex) {
            console.log(ex)
        }
    }
)

//update the user in the json file
app.put(
    "/users",
    async (req: Request, res: Response) => {
        try {
            if (req.body) {
                const updatedUser = req.body;
                const results = req.body ? users.find((obj: { id: any; }) => obj.id === req.body.id) : 'User not found';
                await removeItem(users, results);
                users.push(updatedUser);
                fs.writeFileSync(path.resolve(__dirname, './data/Users.json'), JSON.stringify(users))

                return res.status(200).send({
                    message: 'success'
                })
            }
            
        } catch (ex) {
            console.log(ex)
        }


    }
)

//remove item in a json array file
async function removeItem(array: any, item: any) {
    for (const i in array) {
        if (array[i].id === item.id) {
            array.splice(i, 1);
            break;
        }
    }
}


try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured: ${error}`);
}

