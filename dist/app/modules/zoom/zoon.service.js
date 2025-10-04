"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomService = void 0;
const axios_1 = __importDefault(require("axios"));
const ZOOM_BASE_URL = 'https://api.zoom.us/v2';
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenResponse = yield axios_1.default.post(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`, {}, {
            headers: {
                Authorization: 'Basic ' +
                    Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64'),
            },
        });
        return tokenResponse.data.access_token;
    });
}
exports.ZoomService = {
    createMeeting(hostName, topic, date, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield getAccessToken();
            const start_time = `${date}T${time}:00Z`; // ISO string
            const response = yield axios_1.default.post(`${ZOOM_BASE_URL}/users/me/meetings`, {
                topic,
                type: 2, // scheduled
                start_time,
                duration: 60,
                settings: {
                    join_before_host: false,
                    approval_type: 0,
                    meeting_authentication: false,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return {
                joinUrl: response.data.join_url,
                startUrl: response.data.start_url,
            };
        });
    },
};
