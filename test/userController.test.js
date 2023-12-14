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
                .get('/api/users/1') // Asumiendo que el ID 1 es un usuario existente
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
                contraseña: 'contraseñaSegura'
            };

            chai.request(server)
                .post('/api/users/register')
                .send(newUser)
                .end((err, res) => {
                    if (err) {
                        console.log('Error:', err.message);
                    }
                    console.log('Response:', res.body);

                    expect(res).to.have.status(201);
                    // Aquí puedes agregar más verificaciones según sea necesario
                    done();
                });
        });
    });

    // Añade aquí las pruebas para actualizar y eliminar usuarios si es necesario
});

// Continúa con pruebas para actualizar y eliminar usuarios
