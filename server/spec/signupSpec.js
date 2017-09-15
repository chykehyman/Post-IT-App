import supertest from 'supertest';
// import jasmine from 'jasmine';
import expect from 'expect';
import app from '../app';
import Users from '../models/users';
import Groups from '../models/groups';
import UsersGroups from '../models/usersGroups';
import Messages from '../models/messages';

const request = supertest(app);
let userId,
    token,
    groupId;
const token2 = 'wrongAccessToken',
    wrongGroupId = 10;


beforeAll((done) => {
    Users.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true }).then((destroyed) => {
        if (destroyed) {
            console.log('SUCCESS DESTROYING USERS TABLE');
        } else { console.log('FAILURE DESTROYING USERS TABLE'); }
        done();
    });

    Messages.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true }).then((destroyed) => {
        if (destroyed) {
            console.log('SUCCESS DESTROYING MESSAGES TABLE');
        } else { console.log('FAILURE DESTROYING MESSAGES TABLE'); }
        done();
    });

    Groups.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true }).then((destroyed) => {
        if (destroyed) {
            console.log('SUCCESS DESTROYING GROUPS TABLE');
        } else { console.log('FAILURE DESTROYING GROUPS TABLE'); }
        done();
    });

    UsersGroups.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true }).then((destroyed) => {
        if (destroyed) {
            console.log('SUCCESS DESTROYING USERSGROUPS TABLE');
        } else { console.log('FAILURE DESTROYING USERSGROUPS TABLE'); }
        done();
    });
});

// Total of seven(7) tests
describe('ALL ROUTE TESTING ', () => {
    describe('SIGNUP OPERATIONS', () => {
        describe('SIGNUP POSITIVE TESTS', () => {
            it('Should be able to create a new user account successfully', (done) => {
                const user = {
                    username: 'chykebaba',
                    email: 'chyke@gmail.com',
                    password: 'ilovecoding',
                    repassword: 'ilovecoding'
                };
                request.post('/api/user/signup')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('success').toBe(res.body.status);
                        expect('Account has been created successfully').toBe(res.body.message);
                        expect('chyke@yahoo.com').toNotBe(res.body.data.email);
                        expect('chykebaba').toBe(res.body.data.username);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should be able to create another new user account successfully', (done) => {
                const user = {
                    username: 'tobe',
                    email: 'tobe@yahoo.com',
                    password: 'ilovecoding',
                    repassword: 'ilovecoding'
                };
                request.post('/api/user/signup')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('success').toBe(res.body.status);
                        expect('Account has been created successfully').toBe(res.body.message);
                        expect('tobe@gmail.com').toNotBe(res.body.data.email);
                        expect('tobe').toBe(res.body.data.username);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
        });
        describe('SIGNUP NEGATIVE TESTS', () => {
            // All required validation middleware tests
            it('Should not be able to create a new account when one or more field(s) is(are) undefined(missing)', (done) => {
                // password field is undefined(missing) in the user object
                const user = {
                    username: 'chykebaba',
                    email: 'chyke@gmail.com',
                    repassword: 'ilovecoding'
                };
                request.post('/api/user/signup')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('All or some fields are not defined').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to create a new account with empty input fields', (done) => {
                const user = {
                    username: '',
                    email: '',
                    password: '',
                    repassword: ''
                };
                request.post('/api/user/signup')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Username is required').toBe(res.body.errors.username);
                        expect('Email is required').toBe(res.body.errors.email);
                        expect('Password is required').toBe(res.body.errors.password);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to create a new account when number(s) begins the username field, invalid email field and password length is not between 8 and 30', (done) => {
                const user = {
                    username: '645chikebaba_23',
                    email: 'chike@gmail',
                    password: 'code',
                    repassword: 'code'
                };
                request.post('/api/user/signup')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Username should not start with number(s)').toBe(res.body.errors.username);
                        expect('Email is invalid').toBe(res.body.errors.email);
                        expect('Password length must be between 8 and 30').toBe(res.body.errors.password);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to create a new account with mismatching password and confirm password fields', (done) => {
                const user = {
                    username: 'chikebaba',
                    email: 'chike@gmail.com',
                    password: 'ilovecoding',
                    repassword: 'ilovecodingjava'
                };
                request.post('/api/user/signup')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Password and confirm password fields mismatched').toBe(res.body.errors.password);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            // Controller validation test
            it('Should not be able to create a new account with an existing username or email record', (done) => {
                // same records from first successful sign up
                const user = {
                    username: 'chykebaba',
                    email: 'chyke@gmail.com',
                    password: 'ilovecoding',
                    repassword: 'ilovecoding'
                };
                request.post('/api/user/signup')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Username or email already exits').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
        });
    });
    describe('SIGNIN, CREATE GROUP, ADD USER, POST MESSAGE AND RETRIEVE GROUP MESSAGES OPERATIONS', () => {
        describe('SIGNIN NEGATIVE OPERATIONS', () => {
            it('Should not be able to login when one or more field(s) is(are) undefined(missing)', (done) => {
                // username field is missing
                const user = { password: 'ilovecoding' };
                request.post('/api/user/signin')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Username or/and password field(s) is/are not defined').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to login with empty input fields', (done) => {
                const user = { username: '', password: '' };
                request.post('/api/user/signin')
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Username is required').toBe(res.body.errors.username);
                        expect('Password is required').toBe(res.body.errors.password);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to login with wrong username', (done) => {
                const user = { username: 'wrongUserName', password: 'anyPassword' };
                request.post('/api/user/signin')
                    .send(user)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('User not found').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to login with wrong password', (done) => {
                const user = { username: 'tobe', password: 'ihatecoding' };
                request.post('/api/user/signin')
                    .send(user)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Invalid Password').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
        });
        describe('SIGNIN POSITIVE OPERATION', () => {
            it('Should be able to login to account created with valid credentials', (done) => {
                const user = { username: 'tobe', password: 'ilovecoding' };
                return request.post('/api/user/signin')
                    .send(user)
                    .expect(200)
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        token = res.body.token;
                        expect('tobe').toBe(res.body.data.username);
                        expect('You are now logged In').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
        });
        describe('CREATE GROUP NEGATIVE OPERATIONS', () => {
            const initial = 'select group type';
            it('Should not be able to access the create group page when security token is undefined(not set)', (done) => {
                const user = { groupName: 'name of group' };
                request.post('/api/group')
                    .send(user)
                    .expect(403)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 16000);
            it('Should not be able to access the create group page with a wrong security token', (done) => {
                const user = { groupName: 'name of group' };
                request.post('/api/group')
                    .set('x-access-token', token2)
                    .send(user)
                    .expect(401)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Failed to authenticate token.').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to create group when one or more field(s) is(are) undefined(missing)', (done) => {
                // groupType and description fields are undefined(missing)
                const user = { groupName: 'name of group' };
                request.post('/api/group')
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('All or some fields are not defined').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it(`Should not be able to create group with empty input fields and groupType as ${initial}`, (done) => {
                const user = { groupName: '', description: '', groupType: `${initial}` };
                request.post('/api/group')
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Group name is required').toBe(res.body.errors.groupName);
                        expect('Group description is required').toBe(res.body.errors.description);
                        expect('Select a group type').toBe(res.body.errors.groupType);
                        if (err) done(err);
                        done();
                    });
            }, 10000);
            it('Should not be able to create group when number begins group name', (done) => {
                const user = { groupName: '45Android Dev', description: 'Buiding Android apps', groupType: 'normal' };
                request.post('/api/group')
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Group name should not start with number(s)').toBe(res.body.errors.groupName);
                        if (err) done(err);
                        done();
                    });
            });
        });
        describe('CREATE GROUP POSITIVE OPERATIONS', () => {
            it('Should be able to create group by a registered user', (done) => {
                const user = { groupName: 'Android Dev', description: 'Buiding Android apps', groupType: 'normal' };
                request.post('/api/group')
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        groupId = Number(res.body.data.groupId);
                        userId = res.body.data.userId;
                        expect('Success').toBe(res.body.status);
                        expect('Group successfully created').toBe(res.body.message);
                        expect(res.body.data.usergroup_groupId).toEqual(groupId);
                        expect('normal').toBe(res.body.data.groupType);
                        expect('Android Dev').toBe(res.body.data.groupName);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to create group with same groupName', (done) => {
                const user = { groupName: 'Android Dev', description: 'Buiding Android apps', groupType: 'normal' };
                request.post('/api/group')
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Group name already exists').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
        });
        describe('ADD REGISTERED USER NEGATIVE AND POSITIVE OPERATIONS', () => {
            it('Should not be able to access the add user page when security token is undefined(not set)', (done) => {
                const user = { username: 'chykebaba' };
                request.post(`/api/group/${groupId}/user`)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to access the add user page with a wrong security token', (done) => {
                const user = { username: 'chykebaba' };
                request.post(`/api/group/${groupId}/user`)
                    .set('x-access-token', token2)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Failed to authenticate token.').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to add a user with missing input field', (done) => {
                const user = {};
                request.post(`/api/group/${groupId}/user`)
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Username field is undefined(missing)').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to add a user with empty username input field', (done) => {
                const user = { username: '' };
                request.post(`/api/group/${groupId}/user`)
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Username field is required').toBe(res.body.errors.username);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to add a non existing user to a group', (done) => {
                const user = { username: 'vick' };
                request.post(`/api/group/${groupId}/user`)
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Username does not exist').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to add a user to a group which he/she already exist in', (done) => {
                const user = { username: 'tobe' };
                request.post(`/api/group/${groupId}/user`)
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('User already exist in this group').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should be able to add a user to a group', () => {
                const user = { username: 'chykebaba' };
                request.post(`/api/group/${groupId}/user`)
                    .set('x-access-token', token)
                    .send(user)
                    .expect(200)
                    .end((err, res) => {
                        expect('Success').toBe(res.body.status);
                        expect('User successfully added').toBe(res.body.message);
                        // if (err) done(err);
                        // done();
                    });
            });
        });
        describe('POST MESSAGE NEGATIVE AND POSITIVE OPERATIONS', () => {
            const initial2 = 'select priority level';
            it('Should not be able to access the post message page when security token is undefined(not set)', (done) => {
                const post = { message: 'Work resumes tomorrow', priority: 'normal' };
                request.post(`/api/group/${groupId}/message`)
                    .send(post)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to access the post message page with a wrong security token', (done) => {
                const post = { message: 'Work resumes tomorrow', priority: 'normal' };
                request.post(`/api/group/${groupId}/message`)
                    .set('x-access-token', token2)
                    .send(post)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Failed to authenticate token.').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to post message with missing input field', (done) => {
                // message field is undefined(missing)
                const post = { priority: 'normal' };
                request.post(`/api/group/${groupId}/message`)
                    .set('x-access-token', token)
                    .expect(200)
                    .send(post)
                    .end((err, res) => {
                        expect('Message or/and priority field(s) is/are not defined(missing)').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it(`Should not be able to post message with empty message input field and priority field as ${initial2}`, (done) => {
                const post = { message: '', priority: `${initial2}` };
                request.post(`/api/group/${groupId}/message`)
                    .set('x-access-token', token)
                    .expect(200)
                    .send(post)
                    .end((err, res) => {
                        expect('Message field is required').toBe(res.body.errors.message);
                        expect('Select message priority level').toBe(res.body.errors.priority);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to post message if groupId and userId does not form pairs from the UsersGroups table', (done) => {
                const post = { message: 'Work resumes tomorrow', priority: 'normal' };
                request.post(`/api/group/${wrongGroupId}/message`)
                    .set('x-access-token', token)
                    .expect(200)
                    .send(post)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Error posting message. Group ID and User ID are not a matching pair').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should be able to post message to created group', (done) => {
                const post = { message: 'Work resumes tomorrow', priority: 'normal' };
                request.post(`/api/group/${groupId}/message`)
                    .set('x-access-token', token)
                    .expect(200)
                    .send(post)
                    .end((err, res) => {
                        expect('Success').toBe(res.body.status);
                        expect('Message has been posted successfully').toBe(res.body.message);
                        expect(userId).toEqual(res.body.data.userId);
                        expect(groupId).toEqual(res.body.data.groupId);
                        expect('normal').toBe(res.body.data.priority);
                        expect('Work resumes tomorrow').toBe(res.body.data.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should be able to post another message to group', (done) => {
                const post = { message: 'Android lesson two starts this friday', priority: 'critical' };
                request.post(`/api/group/${groupId}/message`)
                    .set('x-access-token', token)
                    .expect(200)
                    .send(post)
                    .end((err, res) => {
                        expect('Success').toBe(res.body.status);
                        expect('Message has been posted successfully').toBe(res.body.message);
                        expect(userId).toEqual(res.body.data.userId);
                        expect(groupId).toEqual(res.body.data.groupId);
                        expect('critical').toBe(res.body.data.priority);
                        expect('Android lesson two starts this friday').toBe(res.body.data.message);
                        if (err) done(err);
                        done();
                    });
            });
        });
        describe('RETRIEVE MESSAGE(S) NEGATIVE AND POSITIVE OPERATIONS', () => {
            it('Should not be able to access the retrieve message(s) page when security token is undefined(not set)', (done) => {
                request.get(`/api/group/${groupId}/messages`)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to access the retrieve message(s) page with a wrong security token', (done) => {
                request.get(`/api/group/${groupId}/messages`)
                    .set('x-access-token', token2)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Failed to authenticate token.').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should not be able to retrieve message(s) with wrong group ID', (done) => {
                request.get(`/api/group/${wrongGroupId}/messages`)
                    .set('x-access-token', token)
                    .expect(200)
                    .end((err, res) => {
                        expect('Failed').toBe(res.body.status);
                        expect('Group Id is wrong or does not exist').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
            it('Should be able to retrieve message(s) from a particular group', (done) => {
                request.get(`/api/group/${groupId}/messages`)
                    .set('x-access-token', token)
                    .expect(200)
                    .end((err, res) => {
                        expect('Work resumes tomorrow').toBe(res.body.data[0].message);
                        expect('Android lesson two starts this friday').toBe(res.body.data[1].message);
                        expect('normal').toBe(res.body.data[0].priority);
                        expect('critical').toBe(res.body.data[1].priority);
                        expect(groupId).toEqual(res.body.data[0].groupId);
                        expect(userId).toEqual(res.body.data[0].userId);
                        expect('All message(s) has been received').toBe(res.body.message);
                        if (err) done(err);
                        done();
                    });
            });
        });
    });
});