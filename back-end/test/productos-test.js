let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../src/app')

chai.use(chaiHttp);
const url= 'http://localhost:4000/api';

describe('Productos',()=>{

    it('Sin un token, no debe insertar los productos', (done) => {
        chai.request(url)
        .post('/productos')
        .send({
            "codigo": "codigo1",
            "nombre": "nombre1",
            "precio": 11,
            "categoria": "Categoria1",
            "descripcion": "descripcion1",
            "imagen": "imagen1"
        })
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(403);
        done();
        });
    });

    it('Sin un token, no se debe poder editar los productos', (done) => {
        chai.request(url)
        .put('/productos/P9')
        .send({
            "producto.nombre": "nombre2",
            "producto.precio": 20
        })
        .end( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(403);
        done();
        });
    });

    it('Debría obtener todos los productos', (done) => {
        chai.request(url)
        .get('/productos')
        .end( function(err,res){
            console.log(res.body)
            expect(res).to.have.status(200);
            done();
        });
    });

    it('Debría obtener los productos por categoria', (done) => {
        chai.request(url)
        .get('/productos/C1')
        .end( function(err,res){
            console.log(res.body)
            expect(res).to.have.status(200);
            done();
        });
    });

    it('Debría obtener solo un producto', (done) => {
        chai.request(url)
        .get('/productos/codigo/P9')
        .end( function(err,res){
            console.log(res.body)
            expect(res).to.have.status(200);
            done();
        });
    });


});
   