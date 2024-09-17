const express = require("express")
const { MongoClient, ServerApiVersion } = require("mongodb");
const dayjs = require("dayjs");
const userModel = require("./model/user.js");

const app = express();

const port = 8000;

const uri = "mongodb+srv://anhvutest:anhvutest@cluster0.pra2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});
console.log("mongo run");

let quantity = 20;

const checkFlashSaleTime = () => {
    const currentTime = dayjs().valueOf();
    const startTime = dayjs(`2024-09-17 09:00:00`).valueOf();
    const endTime = dayjs(`2024-09-17 11:00:00`).valueOf();

    if (currentTime > endTime || currentTime < startTime) {
        return false;
    }

    return true;
}

app.get("/get-init", (req, res) => {
    return res.send({
        code: 200,
        success: true,
        data: {
            on_flash_sale_time: checkFlashSaleTime(),
            quantity_remain: quantity
        }
    });
})

app.post("/product/buy", (req, res) => {
    const data = req.body;

    const onFlashSaleTime = checkFlashSaleTime();
    if (!onFlashSaleTime) {
        return res.send({
            code: 400,
            success: false,
            message: "Flash sale time is end",
            data: {
                on_flash_sale: false
            }
        });
    }

    const phoneNumber = data.phone_number;

    const checkExistingUser = userModel.find({
        "phone_number": phoneNumber
    });

    if (checkExistingUser) {
        return res.send({
            code: 400,
            success: false,
            message: "User existed"
        });
    }

    quantity = quantity - 1;
    userModel.create({
        phone_number: phoneNumber
    });

    return res.send({
        code: 200,
        success: true,
        message: "Buy product success fully",
        data: {
            quantity_remain: quantity
        }
    });
})

app.listen(port, () => {
    console.log(`app run on port ${port}`);
})

