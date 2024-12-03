const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server");

jest.setTimeout(10000)

describe("User Signup", () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        await mongoose.connect("mongodb://localhost:27017/test");
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    test("all fields are required", async () => {
        const newuser = {
            username: "",
            email: "",
            password: "",
            role: "user",
        };

        const response = await supertest(app).post("/surveyheart/signup").send(newuser);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Please fill in all fields")
    })

    test("Successful signup with valid data", async () => {
        const newuser = {
            username: "testuser",
            email: "testuser1@gmail.com",
            password: "7675",
            role: "user",
        };

        const response = await supertest(app).post("/surveyheart/signup").send(newuser);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Signup successful");
        expect(response.body.saved).toMatchObject({
            username: newuser.username,
            email: newuser.email,
            role: newuser.role,
        });
    });

    test("Signup with duplicate email", async () => {
        const newuser = {
            username: "testuser",
            email: "testuser1@gmail.com",
            password: "7675",
            role: "user",
        };

        const response = await supertest(app).post("/surveyheart/signup").send(newuser)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Email already exists")


    })

});


describe("user login ", () => {

    beforeAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        await mongoose.connect("mongodb://localhost:27017/test");
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    test("all fields are required", async () => {
        const newuser = {
            email: "",
            password: "",
        };

        const response = await supertest(app).post("/surveyheart/login").send(newuser);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Please fill in all fields")
    })

    // test("invalid email", async () => {
    //     const newuser = {
    //         email: "testuser@gmail.com",
    //         password: "76751",
    //     }

    //     const response = await supertest(app).post("/surveyheart/login").send(newuser)
    //     // console.log(response)
    //     expect(response.status).toBe(400)
    //     // console.log(response.status)
    //     expect(response.body.message).toEqual("Email does not exist")

    // })

    // test("invalid password", async () => {
    //     const newuser = {
    //         email: "testuser@gmail.com",
    //         password: "76751",
    //     }

    //     const response = await supertest(app).post("/surveyheart/login").send(newuser)
    //     // console.log(response)
    //     expect(response.status).toBe(400)
    //     console.log(response.status)
    //     expect(response.body).toEqual("Password is incorrect")

    // })

})
