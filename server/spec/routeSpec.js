import supertest from 'supertest';
// import jasmine from 'jasmine';
import expect from 'expect';
import app from '../app';
import Users from '../models/users';

const request = supertest(app);

describe('ROUTE TESTING ', () => {
    beforeAll((done) => {
        Users.destroy({ where: {} }, { truncate: true }).then((destroyed) => {
            if (destroyed) {
                console.log('Done deleting');
            }
            done();
        });
    });
    describe('SIGNUP', () => {
        it('Should not be able to create a new account with empty input fields', (done) => {
            request.post('/api/signup')
                .send({ name: '', username: '', email: '', password: '' })
                .expect(200)
                .end((err, res) => {
                    expect('This field is required').toBe(res.body.errors.name);
                    expect('This field is required').toBe(res.body.errors.username);
                    expect('This field is required').toBe(res.body.errors.name);
                    done(err);
                });
        }, 10000);
        it('Should not be able to create a new account with number as inputs in name and username field', (done) => {
            request.post('/api/signup')
                .send({ name: '24', username: '6773', email: 'jyyyu@gmail.com', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.name);
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.username);
                    done(err);
                });
        }, 10000);
        it('Should not be able to create a new account without any field', (done) => {
            request.post('/api/signup')
                .send({ username: 'Kenet', email: 'jyyyu@gmail.com', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    expect('name, username, email, password and confirmPassword fields are required').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should not be able to create a new account with alphanumeric input in name and username fields', (done) => {
            request.post('/api/signup')
                .send({ name: '0093ggggs', username: '999shshhs', email: 'jyyyu@gmail.com', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.name);
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.username);
                    done(err);
                });
        }, 10000);
        it('Should be able to create a new account', (done) => {
            request.post('/api/signup')
                .send({ name: 'Eze', username: 'Kenet', email: 'jyyyu@gmail.com', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    console.log(res.body.data.name);
                    expect('success').toBe(res.body.status);
                    expect('Account created').toBe(res.body.message);
                    expect('Jane').toNotBe(res.body.data.name);
                    expect('Kenet').toBe(res.body.data.username);
                    done(err);
                });
        }, 10000);
        it('Should not be able to create account with existing records', (done) => {
            request.post('/api/signup')
                .send({ name: 'Eze', username: 'Kenet', email: 'jyyyu@gmail.com', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    expect('Record exists already').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
    });
    describe('SIGNIN AND PERFORM OPERATIONS', () => {
        let userId;
        let token;
        let groupId;
        it('Should not be able to login with a missing field', (done) => {
            request.post('/api/signin')
                .send({ password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    expect('username and password fields are required').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should not be able to login with empty input fields', (done) => {
            request.post('/api/signin')
                .send({ username: '', password: '' })
                .expect(200)
                .end((err, res) => {
                    expect('This is a required field').toBe(res.body.errors.username);
                    expect('This is a required field').toBe(res.body.errors.password);
                    done(err);
                });
        }, 10000);
        it('Should not be able to login with number input for name field', (done) => {
            request.post('/api/signin')
                .send({ username: '7788', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.username);
                    done(err);
                });
        }, 10000);
        it('Should not be able to login with number alphanumeric input for name field', (done) => {
            request.post('/api/signin')
                .send({ username: '7788', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.username);
                    done(err);
                });
        }, 10000);
        it('Should be able to login to account created', (done) => {
            request.post('/api/signin')
                .send({ username: 'Kenet', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    token = res.body.token;
                    userId = res.body.data.id;
                    expect(res.body.status).toBe('Success');
                    expect(res.body.data.username).toBe('Kenet');
                    expect(res.body.message).toBe('Logged In');
                    done(err);
                });
        }, 10000);
        it('Should not be able to create group with missing fields', (done) => {
            request.post('/api/group')
                .set('x-access-token', token)
                .send({ description: 'Full stack with js', userId: `${userId}` })
                .expect(200)
                .end((err, res) => {
                    expect('groupName, description and userId fields are required').toBe(res.body.message);
                    done();
                });
        }, 16000);
        it('Should not be able to create group with empty input fields', (done) => {
            request.post('/api/group')
                .set('x-access-token', token)
                .send({ groupName: '', description: '', userId: '' })
                .expect(200)
                .end((err, res) => {
                    expect('This is a required field').toBe(res.body.errors.groupName);
                    expect('This is a required field').toBe(res.body.errors.description);
                    expect('This is a required field').toBe(res.body.errors.userId);
                    done();
                });
        }, 16000);
        it('Should not be able to create group with number as group name fields', (done) => {
            request.post('/api/group')
                .set('x-access-token', token)
                .send({ groupName: '78888', description: '88999', userId: `${userId}` })
                .expect(200)
                .end((err, res) => {
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.groupName);
                    expect('Only alphabets are allowed in this field').toBe(res.body.errors.description);
                    done();
                });
        }, 16000);
        it('Should be able to create group by registered user', (done) => {
            request.post('/api/group')
                .set('x-access-token', token)
                .send({ groupName: 'Andela21', description: 'Full stack with js', userId: `${userId}` })
                .expect(200)
                .end((err, res) => {
                    groupId = res.body.data.id;
                    expect('success').toBe(res.body.status);
                    expect('Group Created').toBe(res.body.message);
                    done();
                });
        }, 16000);
        it('Should not be able to create group with same groupName', (done) => {
            request.post('/api/group')
                .set('x-access-token', token)
                .send({ groupName: 'Andela21', description: 'Full stack with js', userId: `${userId}` })
                .expect(200)
                .end((err, res) => {
                    expect('Invalid input. groupName exists already or userId does not exist').toBe(res.body.status);
                    done();
                });
        }, 16000);
        it('Should not be able to add a user with missing input fields', (done) => {
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send({ userId })
                .expect(200)
                .end((err, res) => {
                    expect('admin and userId fields are required').toBe(res.body.message);
                    done();
                });
        }, 10000);
        it('Should not be able to add a user with empty input fields', (done) => {
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send({ admin: '', userId: '' })
                .expect(200)
                .end((err, res) => {
                    expect('This is a required field').toBe(res.body.errors.admin);
                    expect('This is a required field').toBe(res.body.errors.userId);
                    done();
                });
        }, 10000);
        it('Should be able to add a user to groups', (done) => {
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send({ admin: `${1}`, userId: `${userId}` })
                .expect(200)
                .end((err, res) => {
                    expect('success').toBe(res.body.status);
                    expect('User added').toBe(res.body.message);
                    done();
                });
        }, 10000);
        it('Should not be able to post message with missing input fields', (done) => {
            request.post(`/api/group/${groupId}/messages`)
                .set('x-access-token', token)
                .expect(200)
                .send({ priority: 'Normal', userId: `${userId}` })
                .end((err, res) => {
                    expect('message, priority and userId fields are required').toBe(res.body.message);
                    done();
                });
        }, 10000);
        it('Should not be able to post message with empty input fields', (done) => {
            request.post(`/api/group/${groupId}/messages`)
                .set('x-access-token', token)
                .expect(200)
                .send({ message: '', priority: '', userId: '' })
                .end((err, res) => {
                    expect('This is a required field').toBe(res.body.errors.message);
                    expect('This is a required field').toBe(res.body.errors.priority);
                    expect('This is a required field').toBe(res.body.errors.userId);
                    done();
                });
        }, 10000);
        it('Should be able to post message to created group', (done) => {
            request.post(`/api/group/${groupId}/messages`)
                .set('x-access-token', token)
                .expect(200)
                .send({ message: 'Its working', priority: 'Normal', userId: `${userId}` })
                .end((err, res) => {
                    expect('success').toBe(res.body.status);
                    expect('Message sent').toBe(res.body.message);
                    expect(userId).toBe(res.body.data.userId);
                    expect('Normal').toBe(res.body.data.priority);
                    expect('Its working').toBe(res.body.data.message);
                    done();
                });
        }, 10000);
        it('Should be able to post another message to group', (done) => {
            request.post(`/api/group/${groupId}/messages`)
                .set('x-access-token', token)
                .expect(200)
                .send({ message: 'Its pretty cool we consider React in this project', priority: 'Normal', userId: `${userId}` })
                .end((err, res) => {
                    expect('success').toBe(res.body.status);
                    expect('Message sent').toBe(res.body.message);
                    expect(userId).toBe(res.body.data.userId);
                    expect('Normal').toBe(res.body.data.priority);
                    expect('Its pretty cool we consider React in this project').toBe(res.body.data.message);
                    done();
                });
        }, 10000);
        it('Should be able to get messages in a particular group', (done) => {
            request.get(`/api/group/${groupId}/messages`)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect('Its working').toBe(res.body.data[0].message);
                    expect('Its pretty cool we consider React in this project').toBe(res.body.data[1].message);
                    expect('Normal').toBe(res.body.data[0].priority);
                    expect(groupId).toBe(res.body.data[0].groupId);
                    expect(userId).toBe(res.body.data[0].userId);
                    done();
                });
        }, 1000);
    });
    describe('NEGATIVE TESTS', () => {
        let token2;
        // let userId2;
        it('Should NOT be able to login with wrong username', (done) => {
            request.post('/api/signin')
                .send({ username: 'enet', password: 'azundu' })
                .end((err, res) => {
                    expect(res.body.status).toBe('User not found');
                    done(err);
                });
        }, 10000);
        it('Should NOT be able to login with wrong username', (done) => {
            request.post('/api/signin')
                .send({ username: 'enet', password: 'azundu' })
                .end((err, res) => {
                    expect('User not found').toBe(res.body.status);
                    done(err);
                });
        }, 10000);
        it('Should NOT be able to login with wrong password', (done) => {
            request.post('/api/signin')
                .send({ username: 'Kenet', password: 'zundu' })
                .end((err, res) => {
                    expect('Invalid Password').toBe(res.body.status);
                    done(err);
                });
        }, 10000);
        it('Should be able to login to account created', (done) => {
            request.post('/api/signin')
                .send({ username: 'Kenet', password: 'azundu' })
                .expect(200)
                .end((err, res) => {
                    token2 = res.body.token;
                    // usesrId2 = res.body.data.id;
                    expect(res.body.status).toBe('Success');
                    expect(res.body.data.username).toBe('Kenet');
                    expect(res.body.message).toBe('Logged In');
                    done(err);
                });
        }, 10000);
        it('Should NOT be able add user with invalid ids others group', (done) => {
            request.post('/api/group/4/user')
                .set('x-access-token', token2)
                .send({ admin: `${1}`, userId: `${1}` })
                .expect(200)
                .end((err, res) => {
                    expect('Invalid input type. userId or groupId do not exist').toBe(res.body.status);
                    done();
                });
        }, 10000);
        it('Should NOT be able to post message with wrong token', (done) => {
            const token3 = 'hhgggUUjjkkkKddds';
            request.post('/api/group/1/messages')
                .set('x-access-token', token3)
                .expect(200)
                .send({ message: 'Yea, its ok', priority: 'Normal', userId: `${1}` })
                .end((err, res) => {
                    expect('Failed to authenticate token.').toBe(res.body.message);
                    done();
                });
        }, 10000);
        it('Should be denied access to route without token', (done) => {
            request.post('/api/group/1/messages')
                .expect(200)
                .send({ message: 'Good to go', priority: 'Normal', userId: `${1}` })
                .end((err, res) => {
                    expect('Access denied. Login first').toBe(res.body.message);
                    done();
                });
        }, 10000);
    });
});