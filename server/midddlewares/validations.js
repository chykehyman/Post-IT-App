import validator from 'validator';
import isEmpty from 'lodash/isEmpty';


/**
 * Validates all routes
 * @class Validator
 */
export default class Validation {
    /**
     * Validates all sign up details before allowing access to database
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {obj} Validation error messages or Validation success
     */
    static signup(req, res, next) {
        const username = req.body.username,
            email = req.body.email,
            password = req.body.password,
            repassword = req.body.repassword,
            errors = {};
        if (username === undefined || email === undefined || password === undefined || repassword === undefined) {
            res.json({ message: 'All or some fields are not defined' });
        } else {
            if (!(validator.isEmpty(username))) {
                if (validator.toInt(username)) {
                    errors.username = 'Username should not start with number(s)';
                }
            } else { errors.username = 'Username is required'; }

            if (!(validator.isEmpty(email))) {
                if (!(validator.isEmail(email))) {
                    errors.email = 'Email is invalid';
                }
            } else { errors.email = 'Email is required'; }

            if (!(validator.isEmpty(password))) {
                if (validator.isLength(password, { min: 8, max: 30 })) {
                    if (!(validator.isEmpty(repassword))) {
                        if (!(validator.equals(validator.trim(repassword), validator.trim(password)))) {
                            errors.password = 'Password and confirm password fields mismatched';
                        }
                    } else { errors.password = 'Password reconfirmation is required'; }
                } else { errors.password = 'Password length must be between 8 and 30'; }
            } else { errors.password = 'Password is required'; }

            const result = { errors, isValid: isEmpty(errors) };

            if (!result.isValid) {
                res.json({ errors });
            } else {
                next();
            }
        }
    }

    /**
     * Validates signin form input fields before allowing access to the database
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {json} Validation error messages or Validation success
     */
    static signin(req, res, next) {
        const username = req.body.username,
            password = req.body.password,
            errors = {};
        if (username === undefined || password === undefined) {
            res.json({ message: 'Username or/and password field(s) is/are not defined' });
        } else {
            if (validator.isEmpty(username)) {
                errors.username = 'Username is required';
            }

            if (validator.isEmpty(password)) {
                errors.password = 'Password is required';
            }

            const result = { errors, isValid: isEmpty(errors) };

            if (!result.isValid) {
                res.json({ errors });
            } else {
                next();
            }
        }
    }

    /**
     * Validates the creategroup form input fields before allowing access to the database
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {json} Validation error messages or Validation success
     */
    static createGroup(req, res, next) {
        const groupName = req.body.groupName,
            description = req.body.description,
            groupType = req.body.groupType,
            errors = {},
            initial = 'select group type';
        if (groupName === undefined || description === undefined || groupType === undefined) {
            res.json({ message: 'All or some fields are not defined' });
        } else {
            if (!(validator.isEmpty(groupName))) {
                if (validator.toInt(groupName)) {
                    errors.groupName = 'Group name should not start with number(s)';
                }
            } else { errors.groupName = 'Group name is required'; }

            if (validator.isEmpty(description)) {
                errors.description = 'Group description is required';
            }

            if (validator.equals(validator.trim(groupType), validator.trim(initial))) {
                errors.groupType = 'Select a group type';
            }

            const result = { errors, isValid: isEmpty(errors) };

            if (!result.isValid) {
                res.json({ errors });
            } else {
                next();
            }
        }
    }


    /**
     * Validates the inputs before allowing access to the database
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {json} Validation error messages or Validation success
     */
    static addUsers(req, res, next) {
        const errors = {};
        if (req.body.username === undefined) {
            res.json({ message: 'Username field is undefined(missing)' });
        } else {
            if (validator.isEmpty(req.body.username)) {
                errors.username = 'Username field is required';
            }
            // if (!(Number.isInteger(req.body.userId))) {
            //     errors.userId = 'User ID must be a valid number';
            // }
            const result = { errors, isValid: isEmpty(errors) };

            if (!result.isValid) {
                res.json({ errors });
            } else {
                next();
            }
        }
    }


    /** 
     * Validates the message form input fields before allowing access to the database
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {json} Validation error messages or Validation success
     */
    static postMessage(req, res, next) {
        const errors = {},
            initial = 'select priority level';
        if (req.body.message === undefined || req.body.priority === undefined) {
            res.json({ message: 'Message or/and priority field(s) is/are not defined(missing)' });
        } else {
            if (validator.isEmpty(req.body.message)) {
                errors.message = 'Message field is required';
            }

            if (validator.equals(validator.trim(req.body.priority), validator.trim(initial))) {
                errors.priority = 'Select message priority level';
            }
            // if (!(Number.isInteger(req.body.userId))) {
            //     errors.userId = 'User ID must be a valid number';
            // }
            const result = { errors, isValid: isEmpty(errors) };

            if (!result.isValid) {
                res.json({ errors });
            } else {
                next();
            }
        }
    }
}