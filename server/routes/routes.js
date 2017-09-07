import express from 'express';
import Controller from '../controllers/controllers';
import Validate from '../midddlewares/validations';
import VerifyToken from '../midddlewares/checkToken';

const router = express.Router();

// Route for user signup
// router.post('/user/signup', Controller.signup);
router.route('/user/signup')
    .post(Validate.signup, Controller.signup);

// // Route for signin
router.post('/user/signin', Validate.signin, Controller.signin);
// router.post('/user/signin', Controller.signin);


// // // Middleware to protect routes
// router.use(Controller.ensureToken);

// // // Route to allow users create groups
router.post('/group', VerifyToken.checkToken, Validate.createGroup, Controller.createGroup);
// router.post('/group', Controller.createGroup);

// // // Route that allow users add other users to groups
router.post('/group/:groupId/user', VerifyToken.checkToken, Validate.addUsers, Controller.addUsers);

// // // Route to post message to groups
router.post('/group/:groupId/message', VerifyToken.checkToken, Validate.postMessage, Controller.postMessage);

// // Route to get messages posted to a group
router.get('/group/:groupId/messages', VerifyToken.checkToken, Controller.getMessage);


// Route for logout
/* router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: 'Logged out' });
    }
  });
}); */

//     res.redirect('/');


export default router;