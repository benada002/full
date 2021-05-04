import { getRepository } from 'typeorm';
import { verifyAccessTokenAndGetPayload } from '../auth';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

export async function addPost(req, res) {
  try {
    const { title, content } = req.body;
    const { id } = verifyAccessTokenAndGetPayload(req);

    if (!id) {
      res.send({
        success: false,
        error: 'No user',
        post: null,
      });

      return;
    }

    const user = await User.findOneOrFail(id);

    const post = await Post.create({
      title,
      content,
      user,
    }).save();

    delete post?.user?.password;

    res.send({
      success: true,
      error: null,
      post,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
      post: null,
    });
  }
}

export async function getPosts(req, res) {
  try {
    const postRepo = getRepository(Post);
    const posts = (await postRepo.find({
      relations: ['user'],
    })).map((post) => {
      delete post?.user?.password;

      return post;
    });

    res.send({
      success: true,
      count: await posts.length,
      posts,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      count: 0,
      posts: [],
      error,
    });
  }
}

export async function getPost(req, res) {
  const postId = req?.params?.postId;

  try {
    const postRepo = getRepository(Post);
    const post = (await postRepo.findOneOrFail(postId, {
      relations: ['user'],
    }));

    delete post?.user?.password;

    res.send({
      success: true,
      post,
      error: null,
    });
  } catch (error) {
    res.send({
      success: false,
      post: null,
      error,
    });
  }
}

export async function updatePost(req, res) {
  const postId = req?.params?.postId;
  const { title, content } = req.body;

  try {
    const { id } = verifyAccessTokenAndGetPayload(req);
    const postRepo = getRepository(Post);
    const post = (await postRepo.findOneOrFail(postId, {
      relations: ['user'],
    }));

    if (id !== post.user.id) {
      res.send({
        success: false,
        error: 'Not the autor',
        post,
      });

      return;
    }

    if (title && typeof title === 'string') post.title = title;
    if (content && typeof content === 'string') post.content = content;

    post.save();

    delete post?.user?.password;

    res.send({
      success: true,
      post,
      error: null,
    }).end();

    return;
  } catch (error) {
    res.send({
      success: false,
      post: null,
      error,
    }).end();
  }
}

export async function deletePost(req, res) {
  const postId = req?.params?.postId;

  try {
    const { id } = verifyAccessTokenAndGetPayload(req);
    const postRepo = getRepository(Post);
    const post = (await postRepo.findOneOrFail(postId, {
      relations: ['user'],
    }));

    if (id !== post.user.id) {
      res.send({
        success: false,
        error: 'Not the autor',
        post,
      });

      return;
    }

    post.remove();

    delete post?.user?.password;

    res.send({
      success: true,
      post,
      error: null,
    }).end();

    return;
  } catch (error) {
    res.send({
      success: false,
      post: null,
      error,
    }).end();
  }
}
