import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log( username, password  );
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  //@ts-ignore
  req.session.user = newUser;
  res.status(201).json({ message: 'User registered', user: newUser });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  //@ts-ignore
  req.session.user = user;
  res.json({ message: 'Logged in successfully', user });
};

export const getSession = (req: Request, res: Response) => {
  //@ts-ignore
  if (req.session.user) {
    //@ts-ignore
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};
