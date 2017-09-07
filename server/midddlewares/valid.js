import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';


/**
 * @class Validator
 */
export default class Validation {
    /**
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @return {json} Validates signup input form fields before allowing access to the db
     */
    static signup(uname, email, pass, repass) {
        let errors = {};
        let data = "";
        if (uname == undefined || email == undefined || pass == undefined || repass == undefined) {
            errors.message = 'All or some fields are not defined';
            return errors;
        } else {
            delete errors.message;
            if (validator.isEmpty(uname)) {
                errors.username = 'Username is required';
            } else { delete errors.username; }

            if (!(validator.isEmpty(email))) {
                delete errors.email;
                if (validator.isEmail(email)) {
                    delete errors.email;
                } else { errors.email = 'Email is invalid'; }
            } else { errors.email = 'Email is required'; }

            if (!(validator.isEmpty(pass))) {
                delete errors.password;
                if (validator.isLength(pass, { min: 8, max: 30 })) {
                    delete errors.password;
                    if (!(validator.isEmpty(repass))) {
                        delete errors.repassword;
                        if (validator.equals(validator.trim(repass), validator.trim(pass))) {
                            delete errors.repassword;
                        } else { errors.repassword = 'Password mismatched'; }
                    } else { errors.repassword = 'Password reconfirmation is required'; }
                } else { errors.password = 'Password length must be between 8 and 30'; }
            } else { errors.password = 'Password is required'; }

            const result = { errors, isValid: isEmpty(errors) };
            data = uname;

            if (!result.isValid) {
                // return res.json({ errors });
                return errors;
            } else {
                // res.json({ status: 'validation passed' });
                // next();
                return data;
            }
        }
    }

    /**
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @return {json} Validates signin form input fields before allowing access to the db
     */
    static signin(uname, pass) {
        let data = "";
        let errors = {};
        if (uname == undefined || pass == undefined) {
            errors.message = 'Username or/and password field(s) is/are not defined';
            return errors;
            // res.json({ message: 'Username or/and password field(s) is/are not defined' });
        } else {
            if (validator.isEmpty(uname)) {
                errors.username = 'Username is required';
            } else { delete errors.username; }

            if (validator.isEmpty(pass)) {
                errors.password = 'Password is required';
            } else { delete errors.password; }

            const result = { errors, isValid: isEmpty(errors) };
            data = uname;

            if (!result.isValid) {
                // res.json({ errors });
                return errors;
            } else {
                // next();
                return data;
            }
        }
    }

    /**
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @return {json} Validates the creategroup form input fields before allowing access to the db
     */
    static createGroup(gName, des, type) {
        let data = "";
        let errors = {};
        const initial = 'select group type';
        if (gName === undefined || des === undefined || type === undefined) {
            // res.json({ message: 'group name and description fields are required' });
            errors.message = 'All or some fields are not defined';
            return errors;
        } else {
            if (!(validator.isEmpty(gName))) {
                delete errors.groupName;
                if (validator.toInt(gName)) {
                    errors.groupName = 'Only alphabets are allowed in this field';
                } else { delete errors.groupName; }
            } else { errors.groupName = 'Group name is required'; }

            if (validator.isEmpty(des)) {
                errors.description = 'Group description is required';
            } else { delete errors.description; }

            if (validator.equals(validator.trim(type), validator.trim(initial))) {
                errors.type = 'Select a group type'
            } else { delete errors.type; }

            const result = { errors, isValid: isEmpty(errors) };
            data = gName;

            if (!result.isValid) {
                // res.json({ errors });
                return errors;
            } else {
                // next();
                return data;
            }
        }
    }


    /**
     * @return {json} Validates the inputs before allowing access to the db
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     */
    static addUsers(req, res, next) {
        const errors = {};
        if (req.body.admin === undefined || req.body.userId === undefined) {
            res.json({ message: 'admin and userId fields are required' });
        } else {
            if (validator.isEmpty(req.body.admin)) {
                errors.admin = 'The admin field is required';
            } else { delete errors.admin; }
            if (validator.isEmpty(req.body.userId)) {
                errors.userId = 'Userid field is required';
            } else { delete errors.userId; }

            const result = { errors, isValid: isEmpty(errors) };

            if (!result.isValid) {
                res.json({ errors });
            } else {
                next();
            }
        }
    }



    /** 
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @return {json} Validates the message form input fields before allowing access to the db
     */
    static postMessage(req, res, next) {
        const errors = {};
        if (req.body.message === undefined || req.body.priority === undefined || req.body.userId === undefined) {
            res.json({ message: 'message, priority and userId fields are required' });
        } else {
            if (validator.isEmpty(req.body.message)) {
                errors.message = 'Message field is required';
            } else { delete errors.message; }
            if (req.body.type == 'select priority level') {
                errors.priority = 'Message priority level is required'
            } else { delete errors.priority; }

            if (validator.isEmpty(req.body.userId)) {
                errors.userId = 'This is a required field';
            } else { delete errors.userId; }

            const result = { errors, isValid: isEmpty(errors) };

            if (!result.isValid) {
                res.json({ errors });
            } else {
                next();
            }
        }
    }
}

// const signupData = {
//     username,
//     email,
//     password
// };

// module.exports = { signupData, Validation };