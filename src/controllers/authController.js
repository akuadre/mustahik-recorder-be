import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { successResponse, errorResponse } from "../utils/response.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return errorResponse(res, "Name, email, and password are required", 400);

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists)
    return errorResponse(res, "User already exists with this email", 400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const data = {
    user,
  };

  return successResponse(res, "Successfully created user.", data, 201);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return errorResponse(res, "Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, "Invalid email or password", 401);
  }

  const data = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    },
  };

  // generate JWT
  const token = generateToken(user.id, res);
  data.token = token;

  return successResponse(res, "Login success", data, 200);
};

export { register, login };
