"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow credentials (cookies)
};
const io = new socket_io_1.Server(server, { cors: corsOptions });
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
mongoose_1.default.connect('mongodb+srv://chat:chat@chat.e9lyu.mongodb.net/')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
// User Routes
app.use('/api/users', userRoute_1.default);
// Socket.IO implementation
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('send_message', ({ sender, receiver, message }) => {
        console.log('Received message:', { sender, message });
        socket.broadcast.emit('receive_message', { sender, message });
        // socket.emit("teri maa ki chut");
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
server.listen(5000, () => console.log('Server running on port 5000'));
