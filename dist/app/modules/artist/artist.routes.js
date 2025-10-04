"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const artist_controller_1 = require("./artist.controller");
const router = express_1.default.Router();
router.get('/popular-musicians', 
//   auth(USER_ROLES.USER),
artist_controller_1.ArtistController.popularArtistFromDB);
router.get('/', artist_controller_1.ArtistController.artistListFromDB);
router.get('/available-musicians', 
//   auth(USER_ROLES.USER),
artist_controller_1.ArtistController.availableArtistFromDB);
router.get('/:category', 
//   auth(USER_ROLES.USER),
artist_controller_1.ArtistController.artistByCategoryFromDB);
// router.get('/', auth(USER_ROLES.USER), ArtistController.artistListFromDB);
router.get('/profile/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ARTIST), artist_controller_1.ArtistController.artistProfileFromDB);
exports.ArtistRoutes = router;
