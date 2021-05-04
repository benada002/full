import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card, CardContent, Container, Grid, TextField,
} from '@material-ui/core';
import { API_URL } from '../lib/constants';

export default function Signup() {
  const [username, setUserame] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { push } = useRouter();

  const handleSignup = async () => {
    const res = await (await fetch(`${API_URL}/user/create`, {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        name,
        password,
      }),
    })).json();

    const loggedIn = res.success;
    localStorage.setItem('token', res?.accessToken ?? '');

    if (loggedIn) push('/');
  };

  return (
    <Box height="100vh">
      {(props) => (
        <Grid {...props} container alignItems="center">
          <Container maxWidth="xs">
            <Card>
              <CardContent>
                <form>
                  <Grid container direction="column" spacing={2} alignItems="stretch">
                    <Grid item xs={12}>
                      <TextField fullWidth name="username" label="Username" value={username} onChange={(e) => setUserame(e.target.value)} type="text" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth name="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth name="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} type="text" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth name="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <Button fullWidth variant="contained" color="primary" type="button" onClick={handleSignup}>Login</Button>
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
