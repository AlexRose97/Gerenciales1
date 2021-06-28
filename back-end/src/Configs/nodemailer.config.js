const nodemailer = require("nodemailer");
const config = require("../Configs/claves");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass,
    },
});

module.exports.sendConfirmationEmail = (username, correo) => {
    transport.sendMail({
        from: user,
        to: correo,
        subject: "Correo de confirmación",
        html: `<h1>KAAN</h1>
          <h2>Bienvenido ${username}</h2>
          <p> Gracias por subscribirse a "KAAN", el lugar perfecto para que realices todas tus compras. </p>
          </div>`,
    }).catch(err => console.log(err));
};

module.exports.sendRecoverPasswordEmail = (username, correo, codigo) => {
    transport.sendMail({
        from: user,
        to: correo,
        subject: "Recuperación de cuenta",
        html: `<h1>KAAN</h1>
        <h2>Hola ${username}</h2>
        <p> Hemos recibido una solicitud para acceder a tu cuenta, ${correo}, a través de tu dirección de correo electrónico. Tu contraseña temporal es: </p>
        <p> ${codigo} </p>
        <p> Te recomendamos cambiar contraseña al iniciar sesión. </p>
        <p> Si no has solicitado la contraseña, puede que alguien esté intentado acceder a la cuenta. </p>
        <p> Atentamente, </p>
        <p> El equipo de Cuentas. </p>
        </div>`,
    }).catch(err => console.log(err));
};

module.exports.sendFactura = (correo, factura) => {
    transport.sendMail({
        from: user,
        to: correo,
        subject: "Factura de compra",
        html: factura,
    }).catch(err => console.log(err));
};