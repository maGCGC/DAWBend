// En test/reportController.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const server = require('../server'); // Asegúrate de que esta es la ruta correcta a tu server.js

describe('ReportController', () => {
    describe('GET /api/reports/total-sales', () => {
        it('should get total sales', (done) => {
            chai.request(server)
                .get('/api/reports/total-sales')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('totalSales');
                    done();
                });
        });
    });

    describe('GET /api/reports/total-purchases', () => {
        it('should get total purchases', (done) => {
            chai.request(server)
                .get('/api/reports/total-purchases')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('totalPurchases');
                    done();
                });
        });
    });

    describe('GET /api/reports/overall-balance', () => {
        it('should get overall balance', (done) => {
            chai.request(server)
                .get('/api/reports/overall-balance')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include.keys('totalSales', 'totalPurchases', 'balance');
                    done();
                });
        });
    });

    // Aquí puedes agregar más pruebas para otros informes si los has implementado
});
