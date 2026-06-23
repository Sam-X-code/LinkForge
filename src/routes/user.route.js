import express from 'express';

const router = express.Router();




router.post('/register', (req, res,next) => {
  res.send('user registerd!!!');
  next()
});




export default router;