import { prisma } from "../config/db.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return errorResponse(res, "Name, email, and password are required", 400);

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists)
    return errorResponse(res, "User already exists with this email", 400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, emailVerified: false },
  });

  // Generate OTP for REGISTER
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.emailOtp.create({
    data: { email, otpHash, purpose: "REGISTER", expiresAt },
  });

  await sendOtpEmail(email, otp, "REGISTER");

  return successResponse(
    res,
    "User created. OTP sent to email.",
    { email },
    201,
  );
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

  // Kalau email belum verified → generate OTP baru
  if (!user.emailVerified) {
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Hapus OTP lama dan simpan yang baru
    await prisma.emailOtp.deleteMany({ where: { email, purpose: "REGISTER" } });
    await prisma.emailOtp.create({
      data: { email, otpHash, purpose: "REGISTER", expiresAt },
    });

    await sendOtpEmail(email, otp, "REGISTER");

    // Kirim response tanpa token
    return successResponse(
      res,
      "Email not verified. OTP sent to email.",
      data,
      200,
    );
  }

  // Kalau email verified → generate JWT
  const token = generateToken(user.id, res);
  data.token = token;

  return successResponse(res, "Login success", data, 200);
};

const logout = async (req, res) => {
  // Ambil token dari cookie atau header
  let token =
    req.cookies?.jwt ||
    (req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  // Validasi: jika token tidak ada
  if (!token) {
    return res.status(400).json({
      status: "fail",
      message: "No token provided, cannot logout",
    });
  }

  try {
    // Masukkan token ke tabel blocked
    await prisma.blockedToken.create({
      data: {
        token,
        userId: req.user.id,
      },
    });

    // Hapus cookie
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return successResponse(res, "Logged out succesfully", 200);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while logging out",
      error: err.message,
    });
  }
};

const getProfile = async (req, res) => {
  const user = req.user;

  return successResponse(
    res,
    "User profile fetched successfully",
    {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    200,
  );
};

export { getProfile, register, login, logout };
