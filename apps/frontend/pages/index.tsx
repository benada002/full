import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Container, Grid,
} from '@material-ui/core';
import { API_URL } from '../lib/constants';

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const { posts: post } = await (await fetch(`${API_URL}/posts`)).json();

      setPosts(post);
    })();
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {posts.length === 0 && <Grid item xs={12}>No Posts</Grid>}
        {
            posts.map(({ id, title }) => (
              <Grid key={id} item xs={12}>
                <Card>
                  <CardContent>{title}</CardContent>
                </Card>
              </Grid>
            ))
        }
      </Grid>
    </Container>
  );
}
