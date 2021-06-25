let chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));
const url = 'http://localhost:4000/api/categorias';

describe('Categorías', () => {
    it('Deberia insertar una categoría', (done) => {
        chai.request(url)
            .post('/')
            .send({
                "codigo": "C100",
                "nombre": "Categoría 100",
                "imagen": "imagen categoría"
            })
            .end(function(err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Debría obtener todas las categorías', (done) => {
        chai.request(url)
            .get('/')
            .end(function(err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});