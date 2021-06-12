import React from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'
import { setAuthCredentials } from '../store/authSlice';
import { useHistory } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl
} from '@material-ui/core';
import { useLoginUserMutation } from '../api';

const schema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').max(255).required('email is required'),
  password: Yup.string().min(5).max(255).required('password is required'),
})

export default function Login() {
  const history = useHistory()
  const dispatch = useDispatch();
  const [loginUser, { isLoading, error, isError, isSuccess }] = useLoginUserMutation()
  const { handleSubmit, control, reset } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      email: ''
    }
  });

  async function onSubmitAddUser({ email, password }) {
    const { data, error } = await loginUser({
      email,
      password
    });

    if (data) {
      dispatch(setAuthCredentials(data.data))
      reset();
      history.replace('/')
    }
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmitAddUser)}>
            <Box sx={{ mb: 3 }}>
              <Typography
                color="textPrimary"
                variant="h2"
              >
                Login
              </Typography>
            </Box>
            <Box mb={2}>
              <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                  }) => (
                    <TextField
                      name={name}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                      variant="outlined"
                      label="Email"
                      error={error ? true : false}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </FormControl>
            </Box>
            <Box mb={2}>
              <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                  }) => (
                    <TextField
                      name={name}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                      variant="outlined"
                      label="Password"
                      error={error ? true : false}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </FormControl>
            </Box>

            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={isLoading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Login
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  )
}
