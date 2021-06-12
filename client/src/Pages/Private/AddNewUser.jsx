import React from 'react';
import * as Yup from 'yup';
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
import { useAddUserMutation } from '../../api';

const schema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').max(255).required('email is required'),
  name: Yup.string().min(5).max(255).required('name is required'),
  password: Yup.string().min(5).max(255).required('password is required'),
})

export default function AddNewUser() {
  const history = useHistory()
  const [addUser, { isLoading, error, isError, isSuccess }] = useAddUserMutation()
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      name: '',
      password: ''
    }
  });
  async function onSubmitAddUser({ name, email, password }) {
    const { data, error } = await addUser({
      name,
      email,
      password
    });

    if (data) {
      reset();
      history.replace('/users')
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
                Add new writer
              </Typography>
            </Box>
            <Box mb={2}>
              <FormControl fullWidth variant="outlined">
                <Controller
                  control={control}
                  name="name"
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
                      label="Name"
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
                Add User
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  )
}
