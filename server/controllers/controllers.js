import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import Users from '../models/users';
import Groups from '../models/groups';
import UsersGroups from '../models/usersGroups';
import Messages from '../models/messages';

env.config();

/**
 * @class ApiController
 */
export default class ApiController {
    /**
     * User details are captured and persisted on the database
     * @param {obj} req
     * @param {obj} res
     * @returns {obj} Failure message or Success message with the persisted database data
     */
    static signup(req, res) {
        const username = req.body.username,
            email = req.body.email,
            password = req.body.password;
        // return res.json({ message: 'in the controller', email, password });
        return Users.sync({ force: false }).then(() => {
            // return res.json({ m: 'done' });
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    Users.create({
                        username,
                        email,
                        password: hash
                    }).then((user) => {
                        // const payload = { username: user.username, userId: user.id };
                        // const token = jwt.sign(payload, process.env.SECRET_KEY, {
                        //     expiresIn: 60 * 60 * 24
                        // });
                        res.status(200);
                        res.json({
                            status: 'success',
                            data: {
                                id: user.id,
                                username: user.username,
                                email: user.email
                            },
                            message: 'Account has been created successfully'
                        });
                    }).catch((err) => {
                        if (err) {
                            res.status(409);
                            res.json({ status: 'Failed', message: 'Username or email already exits' });
                        }
                    });
                });
            });
        });
    }

    /**
     * User details are captured and authenticated against persisted database data
     * @param {obj} req
     * @param {obj} res
     * @returns {obj} Failure message or Success message with persisted database data
     */
    static signin(req, res) {
        const username = req.body.username,
            password = req.body.password,
            randomWord = 'kitongifuuiiwtylkkksshdywywy';
        // return res.json({ message: 'in the sign in controller', data: { username, password } });

        Users.findOne({ where: { username } }).then((user) => {
            if (user && user.username === username) {
                const check = bcrypt.compareSync(password, user.password);
                if (check) {
                    const payload = { username: user.username, userId: user.id };
                    const token = jwt.sign(payload, randomWord, {
                        expiresIn: 60 * 60
                    });
                    // const token = jwt.sign(payload, process.env.SECRET_KEY, {
                    //     expiresIn: 5
                    // });
                    req.token = token;
                    res.status(200);
                    res.json({
                        status: 'Success',
                        message: 'You are now logged In',
                        data: { id: user.id, username: user.username },
                        token
                    });
                } else {
                    res.status(401);
                    res.json({ status: 'Failed', message: 'Invalid Password' });
                }
            } else {
                res.json({ status: 'Failed', message: 'User not found' });
            }
        });
        // .catch((err) => {
        //     if (err) {
        //         res.json({ message: 'Username may be wrong' });
        //     }
        // });
    }


    /**
     * Create a group
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {obj} Failure message or Success message with persisted data
     */
    static createGroup(req, res) {
        const groupName = req.body.groupName,
            description = req.body.description,
            groupType = req.body.groupType,
            userId = req.decoded.userId;
        // req.body.userId = req.decoded.userId;
        // return res.json({ message: 'in the create group controller', data: req.body });
        return Groups.sync({ force: false }).then(() => {
            Groups.create({ groupName, description, groupType, userId }).then((group) => {
                // return res.json({ m: 'done' });
                // Groups.create(req.body).then((group) => {
                if (group) {
                    return UsersGroups.sync({ force: false }).then(() => {
                        UsersGroups.create({ admin: 'yes', userId: group.userId, groupId: group.id, });
                    }).then((usergroup) => {
                        if (usergroup && usergroup.groupId === group.id && usergroup.userId === group.userId) {
                            res.json({
                                status: 'success',
                                data: {
                                    usergroup_groupId: usergroup.groupId,
                                    groupId: group.id,
                                    groupName: group.groupName,
                                    groupType: group.groupType
                                },
                                message: 'Group successfully created'
                            });
                        }
                    });
                }
            }).catch((err) => {
                if (err) {
                    res.json({ status: 'Failed', message: 'Group name already exists' });
                }
            });
        });
    }

    /**
     * Adds a user to a group
     * @param {obj} req
     * @param {obj} res
     * @returns {obj} Failure message or Success message with persisted data
     */
    static addUsers(req, res) {
        const groupId = req.params.groupId;
        // username = req.body.username;
        Users.findOne({ where: { username: req.body.username } }).then((user) => {
            if (!user) {
                res.json({ message: 'Username does not exist' });
            } else {
                return UsersGroups.sync({ force: false }).then(() => {
                    UsersGroups.findOrCreate({ where: { userId: user.id, groupId } })
                        .spread((usergroup, created) => {
                            if (created) {
                                res.json({
                                    status: 'Success',
                                    message: 'User successfully added'
                                });
                            } else {
                                res.json({
                                    status: 'Failed',
                                    message: 'User already exist in this group'
                                });
                            }
                        });
                });
            }
        });
    }

    /**
     * Post message to specified groups
     * @param {obj} req
     * @param {obj} res
     * @returns {obj} Failure message or Success message with persisted data
     */
    static postMessage(req, res) {
        // const message = req.body.message, priority = req.body.priority;
        const userId = req.decoded.userId,
            groupId = req.params.groupId;
        UsersGroups.findOne({ where: { userId, groupId } }).then((found) => {
            if (!found) {
                res.json({ status: 'Failed', message: 'Error posting message. Group ID and User ID are not a matching pair' });
            } else {
                return Messages.sync({ force: false }).then(() => {
                    // return res.json({ m: 'done' });
                    Messages.create({ message: req.body.message, userId, groupId, priority: req.body.priority }).then((data) => {
                        res.status(200).json({
                            status: 'Success',
                            data: {
                                message: data.message,
                                groupId: data.groupId,
                                userId: data.userId,
                                priority: data.priority
                            },
                            message: 'Message has been posted successfully'
                        });
                    });
                });
            }
        });
    }

    /**
     * Get posted messages of a particular group from database
     * @param {obj} req
     * @param {obj} res
     * @return {json} Failure message or Success message with retrieved data
     */
    static getMessage(req, res) {
        const groupId = req.params.groupId;
        Messages.findAll({ where: { groupId } }).then((data) => {
            if (data) {
                res.status(200).json({
                    status: 'Success',
                    data,
                    message: 'All message(s) has been received'
                });
            } else { res.json({ status: 'Failed', message: 'Group Id is wrong or does not exist' }); }
        });
    }
}