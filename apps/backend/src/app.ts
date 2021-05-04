import 'reflect-metadata';
import dotenv from 'dotenv-safe';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import path from 'path';
import {
  login, logout, refreshToken, signUp,
} from './api/user';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Device } from './entities/Device';
import {
  addPost, getPost, getPosts, updatePost, deletePost,
} from './api/post';

const port = process.env.PORT || 8080;

dotenv.config({
  allowEmptyValues: true,
});

(async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const DBCon = createConnection({
      type: 'sqlite',
      database: `${path.resolve(__dirname, '../../../')}/data/db1.sqlite`,
      entities: [User, Post, Device],
      synchronize: true,
      logging: true,
    });

    const app = express();

    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }));

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post('/user/create', signUp);
    app.post('/user/login', login);
    app.get('/user/logout', logout);
    app.get('/user/refresh-token', refreshToken);

    app.post('/post/create', addPost);
    app.get('/posts', getPosts);
    app.get('/post/:postId', getPost);
    app.patch('/post/:postId', updatePost);
    app.delete('/post/:postId', deletePost);

    app.listen(port, () => console.log(`up on ${port}`));
  } catch (err) {
    console.log(err);
  }
})();
