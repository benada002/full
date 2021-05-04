import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card, CardContent, Container, Grid, TextField,
} from '@material-ui/core';
import { authUser, refreshToken } from '../../lib/auth';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      const hasToken = await refreshToken();

      if (hasToken) {
        push('/');
      }
    })();
  }, []);

  const handleLogin = async () => {
    const loggedIn = await authUser(name, password);

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
                      <TextField fullWidth name="username" label="Username or Email" value={name} onChange={(e) => setName(e.target.value)} type="text" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth name="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                      <Button fullWidth variant="contained" color="primary" type="button" onClick={handleLogin}>Login</Button>
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
