// En test/userController.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const server = require('../server'); // Asegúrate de reemplazar esto con la ruta correcta

describe('UserController', () => {
    describe('GET /api/users', () => {
        it('should get all users', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get a user by id', (done) => {
            // Reemplaza '1' con un ID válido de usuario
            chai.request(server)
                .get('/api/users/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    describe('POST /api/users/register', () => {
        it('should register a new user', (done) => {
            const newUser = {
                nombre_usuario: 'NuevoUsuario',
                email: 'nuevo@usuario.com',
                contraseña: 'contraseñaSegura',
                rol: 'user'
            };
            chai.request(server)
                .post('/api/users/register')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    done();
                });
        });
    });

    // Pruebas adicionales para 'updateUser', 'deleteUser', 'loginUser'
});

// Continúa con pruebas para actualizar, eliminar y loguear usuarios
