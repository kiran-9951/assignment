const express =require("express");
const app = express()
const port =3030
const productroutes =require("./routes/productroutes")

app.use(express.json());
app.use("/uploads",express.static("uploads"))
app.use("/products",productroutes)

app.listen(port,()=>{
    console.log(`the server running at ${port}`)
})
