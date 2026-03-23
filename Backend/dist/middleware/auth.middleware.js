import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const authenticateMiddleware = async (req, res, next) => {
    try {
        const cookieToken = req.cookies?.token;
        const headerToken = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : undefined;
        const token = cookieToken || headerToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!(decoded?.id)) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const now = new Date();
        const lastReset = new Date(user.apiUsage.lastReset);
        const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceReset >= 30) {
            user.apiUsage.blogsGenerated = 0;
            user.apiUsage.wordsGenerated = 0;
            user.apiUsage.lastReset = now;
            await user.save();
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
