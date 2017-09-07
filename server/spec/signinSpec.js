import supertest from 'supertest';
// import jasmine from 'jasmine';
import expect from 'expect';
import app from '../app';
// import Users from '../models/users';

const request = supertest(app);

// Total of seven(7) tests

describe('SIGNIN, CREATE GROUP, ADD USER, POST MESSAGE AND RETRIEVE GROUP MESSAGES OPERATIONS', () => {
    let userId,
        token,
        groupId,
        user;
    const token2 = 'wrongAccessToken',
        wrongGroupId = 300;
    describe('SIGNIN NEGATIVE OPERATIONS', () => {
        it('Should not be able to login when one or more field(s) is(are) undefined(missing)', (done) => {
            // username field is missing
            user = { password: 'ilovecoding' };
            request.post('/api/user/signin')
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Username or/and password field(s) is/are not defined').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should not be able to login with empty input fields', (done) => {
            user = { username: '', password: '' };
            request.post('/api/user/signin')
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Username is required').toBe(res.body.errors.username);
                    expect('Password is required').toBe(res.body.errors.password);
                    done(err);
                });
        }, 10000);
        it('Should not be able to login with wrong username', (done) => {
            user = { username: 'wrongUserName', password: 'anyPassword' };
            request.post('/api/user/signin')
                .send(user)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('User not found').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should not be able to login with wrong password', (done) => {
            user = { username: 'tobe', password: 'ihatecoding' };
            request.post('/api/user/signin')
                .send(user)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Invalid Password').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
    });
    describe('SIGNIN POSITIVE OPERATION', () => {
        it('Should be able to login to account created with valid credentials', (done) => {
            user = { username: 'tobe', password: 'ilovecoding' };
            request.post('/api/signin')
                .send(user)
                .expect(200)
                .end((err, res) => {
                    token = res.body.token;
                    userId = res.body.data.userId;
                    expect('Success').toBe(res.body.status);
                    expect('tobe').toBe(res.body.data.username);
                    expect('You are now logged In').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
    });
    describe('CREATE GROUP NEGATIVE OPERATIONS', () => {
        const initial = 'select group type';
        it('Should not be able to access the create group page when security token is undefined(not set)', (done) => {
            user = { groupName: 'name of group' };
            request.post('/api/group')
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to access the create group page with a wrong security token', (done) => {
            request.post('/api/group')
                .set('x-access-token', token2)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Failed to authenticate token.').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to create group when one or more field(s) is(are) undefined(missing)', (done) => {
            // groupType and description fields are undefined(missing) from user object set above
            request.post('/api/group')
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('All or some fields are not defined').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it(`Should not be able to create group with empty input fields and groupType as ${initial}`, (done) => {
            user = { groupName: '', description: '', groupType: `${initial}` };
            request.post('/api/group')
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Group name is required').toBe(res.body.errors.groupName);
                    expect('Group description is required').toBe(res.body.errors.description);
                    expect('Select a group type').toBe(res.body.errors.groupType);
                    done(err);
                });
        }, 16000);
        it('Should not be able to create group when number begins group name', (done) => {
            user = { groupName: '45Android Dev', description: 'Buiding Android apps', groupType: 'normal' };
            request.post('/api/group')
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Group name should not start with number(s)').toBe(res.body.errors.groupName);
                    done(err);
                });
        }, 16000);
    });
    describe('CREATE GROUP POSITIVE OPERATIONS', () => {
        it('Should be able to create group by a registered user', (done) => {
            user = { groupName: 'Android Dev', description: 'Buiding Android apps', groupType: 'normal' };
            request.post('/api/group')
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    groupId = res.body.data.groupId;
                    expect('Success').toBe(res.body.status);
                    expect('Group successfully created').toBe(res.body.message);
                    expect(res.body.data.usergroup_groupId).toEqual(res.body.data.groupId);
                    expect('normal').toBe(res.body.data.groupType);
                    done(err);
                });
        }, 16000);
        it('Should not be able to create group with same groupName', (done) => {
            request.post('/api/group')
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Group name already exists').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
    });
    describe('ADD REGISTERED USER NEGATIVE AND POSITIVE OPERATIONS', () => {
        it('Should not be able to access the add user page when security token is undefined(not set)', (done) => {
            user = { username: 'chykebaba' };
            request.post(`/api/group/${groupId}/user`)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to access the add user page with a wrong security token', (done) => {
            user = { username: 'chykebaba' };
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token2)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Failed to authenticate token.').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to add a user with missing input fields', (done) => {
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send({})
                .expect(200)
                .end((err, res) => {
                    expect('Username field is undefined(missing)').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should not be able to add a user with empty input fields', (done) => {
            user = { username: '' };
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Username field is required').toBe(res.body.errors.username);
                    done(err);
                });
        }, 10000);
        it('Should not be able to add a non existing user to a group', (done) => {
            user = { username: 'vick' };
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Username does not exist').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should not be able to add a user to a group which he/she already exist in', (done) => {
            user = { username: 'tobe' };
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('User already exist in this group').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should be able to add a user to a group', (done) => {
            user = { username: 'chykebaba' };
            request.post(`/api/group/${groupId}/user`)
                .set('x-access-token', token)
                .send(user)
                .expect(200)
                .end((err, res) => {
                    expect('Success').toBe(res.body.status);
                    expect('User successfully added').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
    });
    describe('POST MESSAGE NEGATIVE AND POSITIVE OPERATIONS', () => {
        let post;
        const initial = 'select priority level';
        it('Should not be able to access the post message page when security token is undefined(not set)', (done) => {
            post = { message: 'Work resumes tomorrow', priority: 'normal' };
            request.post(`/api/group/${groupId}/message`)
                .send(post)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to access the create group page with a wrong security token', (done) => {
            request.post(`/api/group/${groupId}/message`)
                .set('x-access-token', token2)
                .send(post)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Failed to authenticate token.').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to post message with missing input fields', (done) => {
            // message field is undefined(missing)
            post = { priority: 'normal' };
            request.post(`/api/group/${groupId}/message`)
                .set('x-access-token', token)
                .expect(200)
                .send(post)
                .end((err, res) => {
                    expect('Message or/and priority field(s) is/are not defined(missing)').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it(`Should not be able to post message with empty message input field and priority field as ${initial} `, (done) => {
            post = { message: '', priority: `${initial}` };
            request.post(`/api/group/${groupId}/message`)
                .set('x-access-token', token)
                .expect(200)
                .send(post)
                .end((err, res) => {
                    expect('Message field is required').toBe(res.body.errors.message);
                    expect('Select message priority level').toBe(res.body.errors.priority);
                    done(err);
                });
        }, 10000);
        it('Should not be able to post message if groupId and userId does not form pairs from the UsersGroups table', (done) => {
            post = { message: 'Work resumes tomorrow', priority: 'normal' };
            request.post(`/api/group/${wrongGroupId}/message`)
                .set('x-access-token', token)
                .expect(200)
                .send(post)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Error posting message. Group ID and User ID are not a matching pair').toBe(res.body.message);
                    done(err);
                });
        }, 10000);
        it('Should be able to post message to created group', (done) => {
            post = { message: 'Work resumes tomorrow', priority: 'normal' };
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
                    done(err);
                });
        }, 10000);
        it('Should be able to post another message to group', (done) => {
            post = { message: 'Android lesson two starts this friday', priority: 'critical' };
            request.post(`/api/group/${groupId}/message`)
                .set('x-access-token', token)
                .expect(200)
                .send(post)
                .end((err, res) => {
                    expect('Success').toBe(res.body.status);
                    expect('Message has been posted successfully').toBe(res.body.message);
                    expect(userId).toBe(res.body.data.userId);
                    expect(groupId).toEqual(res.body.data.groupId);
                    expect('critical').toBe(res.body.data.priority);
                    expect('Android lesson two starts this friday').toBe(res.body.data.message);
                    done(err);
                });
        }, 10000);
    });
    describe('RETRIEVE MESSAGE(S) NEGATIVE AND POSITIVE OPERATIONS', () => {
        it('Should not be able to access the retrieve message(s) page when security token is undefined(not set)', (done) => {
            request.get(`/api/group/${groupId}/messages`)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Access denied. Make sure you are logged in first').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to access the retrieve message(s) page with a wrong security token', (done) => {
            request.get(`/api/group/${groupId}/messages`)
                .set('x-access-token', token2)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Failed to authenticate token.').toBe(res.body.message);
                    done(err);
                });
        }, 16000);
        it('Should not be able to retrieve message(s) with wrong group ID', (done) => {
            request.get(`/api/group/${wrongGroupId}/messages`)
                .set('x-access-token', token)
                .expect(200)
                .end((err, res) => {
                    expect('Failed').toBe(res.body.status);
                    expect('Group Id is wrong or does not exist').toBe(res.body.message);
                    done(err);
                });
        }, 1000);
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
                    done(err);
                });
        }, 1000);
    });
});