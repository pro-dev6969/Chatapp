import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import session from 'express-session';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoute';

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
};

const io = new Server(server, { cors : corsOptions } );

app.use(express.json());
app.use(cors(corsOptions));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

mongoose.connect('mongodb+srv://chat:chat@chat.e9lyu.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/users', userRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('send_message', ({ sender, receiver, message }) => {
    console.log('Received message:', {sender,message});
    socket.broadcast.emit('receive_message', { sender, message });
    
  });



  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
