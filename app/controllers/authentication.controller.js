import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const usersDB = [
  {
    username: 'a',
    email: 'aa@a.com',
    password: '$2a$10$8OtxO6.k9gPQlkWF7SYBcOhLK4uRwTIQcQsQjasjyAYg0NqJDS.gG',
  },
];

async function register(req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    return res
      .status(400)
      .send({ status: 'Error', message: 'Empty credentials' });
  }

  const isExistUser = usersDB.find((user) => user.email === email);
  if (isExistUser) {
    return res.status(400).send({
      status: 'Error',
      message: 'The user with this email already exists',
    });
  }

  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(password, salt);
  const newUser = {
    username,
    email,
    hashPassword,
  };
  // console.log(newUser);
  usersDB.push(newUser);
  console.log(usersDB);
  return res.status(201).send({
    status: 'ok',
    message: `The user ${newUser.username} has been created`,
    redirect: '/',
  });
}

async function login(req, res) {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .send({ status: 'Error', message: 'Empty credentials' });
  }

  const user = usersDB.find((user) => user.email === email);
  if (!user) {
    return res.status(400).send({
      status: 'Error',
      message: 'Invalid credentials',
    });
  }

  const verifyPassword = await bcryptjs.compare(password, user.password);
  console.log(verifyPassword);
  if (!verifyPassword) {
    return res
      .status(400)
      .send({ status: 'Error', message: 'Invalid credentials' });
  }

  const token = jsonwebtoken.sign({ user: user.user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    path: '/',
  };

  res.cookie('jwt', token, cookieOption);
  res.send({ status: 'ok', message: 'User logged', redirect: 'admin' });
}

export const methods = {
  register,
  login,
};
