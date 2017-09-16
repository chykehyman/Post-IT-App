import jwt from 'jsonwebtoken';

/**
 * @class Verify
 */
export default class VerifyToken {
    /**
     * Ensures routes are protected
     * @param {obj} req
     * @param {obj} res
     * @param {obj} next
     * @returns {obj} Failure error message on denied request or User decoded data on granted request
     */
    static checkToken(req, res, next) {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const randomWord = 'kitongifuuiiwtylkkksshdywywy';
        // decode token
        if (token) {
            // verifies secret and checks if expired or not
            jwt.verify(token, randomWord, (err, decoded) => {
                if (err) {
                    res.json({ status: 'Failed', message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403);
            res.json({
                status: 'Failed',
                message: 'Access denied. Make sure you are logged in first'
            });
        }
    }
}