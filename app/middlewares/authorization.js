import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { usersDB } from '../controllers/authentication.controller.js';

dotenv.config();

function onlyAdmin(req, res, next) {
  const logged = checkCookie(req);
  if (logged) {
    return next();
  }

  return res.redirect('/admin');
}

function onlyPublic(req, res, next) {
  const logged = checkCookie(req);
  if (!logged) {
    return next();
  }

  return res.redirect('/');
}

function checkCookie(req) {
  try {
    const cookieJWT = req.headers.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('jwt='))
      .slice(4);
    const decoded = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decoded);
    const user = usersDB.find((user) => user.user === decoded.user);
    console.log(user);

    if (!user) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const methods = {
  onlyAdmin,
  onlyPublic,
};
