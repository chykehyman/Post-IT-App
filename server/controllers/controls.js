import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import Users from '../models/users';
import Groups from '../models/groups';
import UsersGroups from '../models/usersGroups';
import Messages from '../models/messages';
import Validate from '../validations/all_validations';

env.config();

/**
 * @class ApiController
 */
export default class ApiController {
    /**
     * User details are captured by this method on signup and persisted on the database
     * @param {obj} req
     * @param {obj} res
     * @return {JSON obj} Returns success or failure message with the data
     */
    static signup(req, res) {
        let username = req.body.username,
            email = req.body.email,
            password = req.body.password,
            repassword = req.body.repassword,
            info = Validate.signup(username, email, password, repassword);
        if (info != username) {
            return res.json({ info });
        } else {
            return Users.sync({ force: false }).then(() => {
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
                            res.status(200).json({
                                status: 'success',
                                data: {
                                    id: user.id,
                                    username: user.username
                                },
                                message: 'Account created'
                            });
                        }).catch((err) => {
                            if (err) {
                                res.status(409).json({ status: 'failed', message: 'Username already exits' });
                            }
                        });
                    });
                });
            });
        }
    }

    /**
     *
     * @param {obj} req
     * @param {obj} res
     * @return {JSON obj} Returns success or failure message
     */
    static signin(req, res) {
        let username = req.body.username,
            password = req.body.password,
            info = Validate.signin(username, password),
            random_word = 'kitongifuuiiwtylkkksshdywywy';
        if (info != username) {
            return res.json({ info });
        } else {
            Users.findOne({ where: { username } }).then((user) => {
                if (user && user.username === username) {
                    const check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        const payload = { username: user.username, userId: user.id };
                        const token = jwt.sign(payload, random_word, {
                            expiresIn: 60
                        });
                        // const token = jwt.sign(payload, process.env.SECRET_KEY, {
                        //     expiresIn: 5
                        // });
                        res.status(200).json({
                            status: 'Success',
                            data: user.id,
                            message: 'You are now logged In',
                            token: token
                        });
                    } else {
                        res.status(401).json({ status: 'Invalid Password' });
                    }
                } else {
                    res.json({ status: 'User not found' });
                }
            }).catch((err) => {
                if (err) {
                    res.json({ message: 'Username may be wrong' });
                }
            });
        }

    }

    /**
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @return {JSON obj} Returns request object of either user decoded data if request is granted or error messages if request is denied or failed
     */
    static ensureToken(req, res, next) {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const random_word = 'kitongifuuiiwtylkkksshdywywy';
        // decode token
        if (token) {
            // verifies secret and checks if expired or not
            jwt.verify(token, random_word, (err, decoded) => {
                if (err) {
                    res.json({ status: 'Denied', message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).json({
                status: 'failed',
                message: 'Access denied. Make sure you are logged in first'
            });
        }
    }


    /**
     * This method is used for creating a  group
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @return {obj} Returns success or failure message with data
     */
    static createGroup(req, res) {
        let groupName = req.body.groupName,
            description = req.body.description,
            groupType = req.body.groupType,
            userId = req.decoded.userId,
            info = Validate.createGroup(groupName, description, groupType);
        if (info != groupName) {
            return res.json({ info });
        } else {
            return res.json({ userId });
            return Groups.sync({ force: false }).then(() => {
                Groups.create({ groupName, description, groupType, userId }).then((group) => {
                    res.status(200).json({
                        status: 'success',
                        data: {
                            gname: group.groupName,
                            desc: group.description,
                            type: group.groupType
                        },
                        message: 'Group Created'
                    });
                }).catch((err) => {
                    if (err) {
                        res.json({ status: 'Group name already exists' });
                    }
                });
            });
        }
    }

    /**
     * This method maps users to groups they belong to
     * @param {*} req
     * @param {*} res
     * @return {obj} Returns a success message with data or failure message
     */
    static addUsers(req, res) {
        // return res.send('addd user');
        const admin = req.body.admin,
            userId = req.body.userId,
            groupId = req.params.groupId;
        return GroupMembers.sync({ force: false }).then(() => {
            GroupMembers.create({ admin, userId, groupId }).then((data) => {
                res.status(200).json({
                    status: 'success',
                    data,
                    message: 'User added'
                });
            }).catch((err) => {
                if (err) {
                    res.json({ status: 'Invalid input type. userId or groupId do not exist' });
                }
            });
        });
    }

    // /**
    //  *
    //  * @param {obj} req
    //  * @param {obj} res
    //  * @return {obj} Returns success message with data or failure message
    //  */
    // static postMessage(req, res) {
    //     // return res.send('post message');
    //     const message = req.body.message,
    //         userId = req.body.userId,
    //         groupId = req.params.groupId,
    //         priority = req.body.priority;
    //     return Messages.sync({ force: false }).then(() => {
    //         Messages.create({ message, userId, groupId, priority }).then((data) => {
    //             res.status(200).json({
    //                 status: 'success',
    //                 data,
    //                 message: 'Message sent'
    //             });
    //         }).catch((err) => {
    //             if (err) {
    //                 res.json({ status: 'Error posting message' });
    //             }
    //         });
    //     });
    // }

    // /**
    //  * @return {json} Success message with results or error message
    //  * @param {obj} req
    //  * @param {obj} res
    //  */
    // static getMessage(req, res) {
    //     // return res.send('get message');
    //     const groupId = req.params.groupId;
    //     Messages.findAll({
    //         where: { groupId }
    //     }).then((data) => {
    //         if (result) {
    //             res.status(200).json({
    //                 status: 'Success',
    //                 data,
    //                 message: 'All messages has been received'
    //             });
    //         }
    //     }).catch((err) => {
    //         if (err) {
    //             res.json({ status: 'Invalid input. The groupId do not exist' });
    //         }
    //     });
    // }
}

// ValidateSignUp.signup();
// ApiController.signup();