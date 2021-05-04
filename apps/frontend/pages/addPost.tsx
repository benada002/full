import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card, CardContent, Container, Grid, TextField,
} from '@material-ui/core';
import { authFetch } from '../lib/auth';
import { API_URL } from '../lib/constants';

export default function Login() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { push } = useRouter();

  const handleSave = async () => {
    const res = await authFetch(`${API_URL}/post/create`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (res.success) push('/');
  };

  return (
    <Box height="100vh">
      {(props) => (
        <Grid {...props} container alignItems="center">
          <Container maxWidth="lg">
            <Card>
              <CardContent>
                <form>
                  <Grid container direction="column" spacing={2} alignItems="stretch">
                    <Grid item xs={12}>
                      <TextField fullWidth name="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField multiline fullWidth name="content" label="Content" value={content} onChange={(e) => setContent(e.target.value)} type="password" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <Button fullWidth variant="contained" color="primary" type="button" onClick={handleSave}>Save</Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Container>
        </Grid>
      )}
    </Box>
  );
}
