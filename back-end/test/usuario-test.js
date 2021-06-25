let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../src/app')

chai.use(chaiHttp);
const url= 'http://localhost:4000/api/login';

describe('Iniciar sesion',()=>{
    it('Deberia insertar el correo y password', (done) => {
        chai.request(url)
        .post('/')
        .send({
            "correo": "usuario1@gmail.com",
            "password": "1234"
        })
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(400);
        done();
        });
    });
});