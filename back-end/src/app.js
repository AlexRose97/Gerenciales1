const express = require("express");
const cors = require("cors");
const app = express();
const { crearRoles, crearAdmin } = require("./libs/initialSetup");

//settings
app.set("port", 4000);

//middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

crearRoles();
crearAdmin();

//routes
app.use("/api/productos", require("./routes/productos"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/login", require("./routes/autorizaciones"));
app.use("/api/password", require("./routes/passwords"));
app.use("/api/compras", require("./routes/compras"));

module.exports = app;
