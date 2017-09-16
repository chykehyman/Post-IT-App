// import jasmine from 'jasmine';
import expect from 'expect';
import Users from '../models/users';
import Groups from '../models/groups';
import UsersGroups from '../models/usersGroups';
import Messages from '../models/messages';

// TESTING all the models used in the application
describe('All Model Test Suite', () => {
    beforeAll((done) => {
        Users.destroy({ where: {} }, { truncate: true }).then((destroyed) => {
            if (destroyed) {
                console.log('Done deleting users table');
            } else { console.log('could not delete users table'); }
            done();
        });
    });
    describe('Users Model Test Suite', () => {
        it('Should be able to create a new user', (done) => {
            Users.sync({ force: true }).then(() => {
                Users.create({ username: 'Chike', email: 'chike@gmail.com', password: 'ilovecoding' })
                    .then((user) => {
                        if (user) {
                            expect('Chike').toEqual(user.username);
                            //     // expect(user.email).toEqual('');
                            //     // expect(true).toBe(false);
                        }
                        done();
                    }).catch((err) => { done(err); });
            });
        });
    });

    describe('Groups Model Test Suite', () => {
        it('Should be able to create a new group', (done) => {
            Groups.sync({ force: true }).then(() => {
                Groups.create({ groupName: 'Android Dev', description: 'Creating awesome android applications', groupType: 'public', userId: 1 })
                    .then((group) => {
                        expect('Android Dev').toNotBe('Android');
                        expect('Android Dev').toBe(group.groupName);
                        expect('Creating awesome android applications').toBe(group.description);
                        expect('public').toBe(group.groupType);
                        expect(group.userId.toString()).toBe('1');
                        done();
                    });
            }).catch((err) => { done(err); });
        }, 10000);
    });

    describe('UsersGroups Model Test Suite', () => {
        it('Should be able to add users to group I created', (done) => {
            UsersGroups.sync({ force: true }).then(() => {
                UsersGroups.create({ admin: 'yes', userId: 1, groupId: 1 })
                    .then((member) => {
                        expect('yes').toBe(member.admin);
                        expect('1').toBe(member.userId.toString());
                        expect('1').toBe(member.groupId.toString());
                        done();
                    });
            }).catch((err) => {
                done(err);
            });
        }, 10000);
    });

    describe('Messages Model Test Suite', () => {
        it('Should be able to post a message to a group', (done) => {
            Messages.sync({ force: true }).then(() => {
                Messages.create({ message: 'All group members to resume work tommorrow', userId: 1, groupId: 1, priority: 'normal' })
                    .then((message) => {
                        expect('All group members to resume work tommorrow').toBe(message.message);
                        expect('1').toBe(message.userId.toString());
                        expect('1').toBe(message.groupId.toString());
                        expect('normal').toBe(message.priority);
                        done();
                    });
            }).catch((err) => { done(err); });
        }, 10000);
    });
});