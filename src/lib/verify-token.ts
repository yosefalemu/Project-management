import { jwtVerify } from "jose";

export const verifyToken = async (token: string, secret: string) => {
  if (!token) {
    throw new Error("Token is missing");
  }

  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(secret));
    const userId = decoded.payload.id as string;
    return userId;
  } catch (error) {
    console.log("Error while verifying token", error);
    throw new Error("Invalid or expired token");
  }
};
