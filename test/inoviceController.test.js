// En test/invoiceController.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const server = require('../server'); // Asegúrate de reemplazar esto con la ruta correcta

describe('InvoiceController', () => {
    describe('GET /api/invoices', () => {
        it('should get all invoices', (done) => {
            chai.request(server)
                .get('/api/invoices')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /api/invoices/:id', () => {
        it('should get an invoice by id', (done) => {
            chai.request(server)
                .get('/api/invoices/3') // Asegúrate de que este ID exista
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    describe('POST /api/invoices', () => {
        it('should create a new invoice', (done) => {
            const newInvoice = {
                numero_factura: 'FACT-002',
                fecha: '2023-01-15',
                total: 150.00,
                cliente_id: 2,
                usuario_id: 2 // Asegúrate de que estos ID existan
            };
            chai.request(server)
                .post('/api/invoices')
                .send(newInvoice)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    // Aquí puedes agregar pruebas adicionales para 'updateInvoice', 'deleteInvoice'
});

// Continúa con pruebas para actualizar y eliminar facturas
