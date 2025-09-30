"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../app/modules/auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const rule_route_1 = require("../app/modules/rule/rule.route");
const category_route_1 = require("../app/modules/category/category.route");
const lesson_routes_1 = require("../app/modules/lesson/lesson.routes");
const review_routes_1 = require("../app/modules/review/review.routes");
const bookmark_routes_1 = require("../app/modules/bookmark/bookmark.routes");
const artist_routes_1 = require("../app/modules/artist/artist.routes");
const booking_routes_1 = require("../app/modules/booking/booking.routes");
const notification_routes_1 = require("../app/modules/notification/notification.routes");
const payment_routes_1 = require("../app/modules/payment/payment.routes");
const admin_routes_1 = require("../app/modules/admin/admin.routes");
const router = express_1.default.Router();
const apiRoutes = [
    { path: '/user', route: user_route_1.UserRoutes },
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/rule', route: rule_route_1.RuleRoutes },
    { path: '/category', route: category_route_1.CategoryRoutes },
    { path: '/lesson', route: lesson_routes_1.LessonRoutes },
    { path: '/review', route: review_routes_1.ReviewRoutes },
    { path: '/bookmark', route: bookmark_routes_1.BookmarkRoutes },
    { path: '/artist', route: artist_routes_1.ArtistRoutes },
    { path: '/booking', route: booking_routes_1.BookingRoutes },
    { path: '/notification', route: notification_routes_1.NotificationRoutes },
    { path: '/payment', route: payment_routes_1.PaymentRoutes },
    { path: '/admin', route: admin_routes_1.AdminRoutes },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
