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
exports.getSession = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(username, password);
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = new User_1.default({ username, password: hashedPassword });
    yield newUser.save();
    //@ts-ignore
    req.session.user = newUser;
    res.status(201).json({ message: 'User registered', user: newUser });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    //@ts-ignore
    req.session.user = user;
    res.json({ message: 'Logged in successfully', user });
});
exports.login = login;
const getSession = (req, res) => {
    //@ts-ignore
    if (req.session.user) {
        //@ts-ignore
        res.json({ loggedIn: true, user: req.session.user });
    }
    else {
        res.json({ loggedIn: false });
    }
};
exports.getSession = getSession;
