import jwt from "jsonwebtoken";
import Session from "../models/session.js";
// import { generateToken } from "../utils/index.js";

const auth = async (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  const { SECRET } = process.env;

  // If the token is not present, send a 401 unauthorized response
  if (!token) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  // Verify the token using the secret key
  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .send({ message: "Forbidden: TokenExpired token" });
      } else {
        return res.status(403).send({ message: "Forbidden: Invalid token" });
      }
    } else {
      req.user = decoded.user;
      req.session = decoded.session;

    }
    next();
  });
};

const refreshAuth = async (req, res, next) => {
  // Get the token from the request headers
  // const authHeader = req.headers["authorization"];
  const token = req.cookies.refreshToken
  ? req.cookies.refreshToken
  : req.body.token;
  
  //  if (!token) return res.sendStatus(401);
  // const token = authHeader?.split(" ")[1];
  
  // If the token is not present, send a 401 unauthorized response
  if (!token) {
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }
  const { SECRET } = process.env;

  // Verify the token using the secret key
  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .send({ message: "Forbidden: TokenExpired token" });
      } else {
        return res.status(403).send({ message: "Forbidden: Invalid token_" });
      }
    } else {
      const currentSession = await Session.findById(decoded.session);
      if (!currentSession)
        return res
          .status(403)
          .send({ message: "Forbidden: Session not found" });
      if (currentSession.refreshToken !== token) {
        return res
          .status(403)
          .send({ message: "Forbidden: Token already used" });
      }

      req.user = decoded.user;
      req.session = decoded.session;
    }
    next();
  });
};

export { auth, refreshAuth };
