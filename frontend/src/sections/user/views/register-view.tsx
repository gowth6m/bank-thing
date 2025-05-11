import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { PATHS } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config';
import ApiClient from 'src/services/api-client';
import { APPBAR_HEIGHT } from 'src/layout/config';

import { GoogleIcon, FacebookIcon } from 'src/components/custom-icons';

type SignUpFormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
};

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: `calc(100vh - ${APPBAR_HEIGHT.xs})`,
  minHeight: '100%',
  [theme.breakpoints.up('sm')]: {
    height: `calc(100vh - ${APPBAR_HEIGHT.sm})`,
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function RegisterView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
    },
  });

  const mRegister = useMutation({
    mutationFn: async (data: SignUpFormValues) =>
      ApiClient.user.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    onSuccess: () => {
      setErrorMsg(null);
      enqueueSnackbar('Signed up successfully!', { variant: 'success' });
      router.push(PATHS.LOGIN);
    },
    onError: (res: any) => {
      setErrorMsg(res.response?.data?.message ?? 'Sign up failed');
      enqueueSnackbar('Sign up failed', {
        variant: 'error',
      });
    },
  });

  // --------------------------- RENDER ----------------------------

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        {/* <Logo /> */}
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) => mRegister.mutate(data))}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Invalid email address',
                },
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="firstName">First name</FormLabel>
            <TextField
              id="firstName"
              placeholder="First name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName', {
                required: 'First name is required',
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastName">Last name</FormLabel>
            <TextField
              id="lastName"
              placeholder="Last name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName', {
                required: 'Last name is required',
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              id="password"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="••••••"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              autoFocus
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Confirm Password</FormLabel>
            <TextField
              id="passwordConfirm"
              type="password"
              fullWidth
              variant="outlined"
              placeholder="••••••"
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
              autoComplete="current-password"
              autoFocus
              {...register('passwordConfirm', {
                required: 'Password confirmation is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
                validate: (value) => {
                  if (value !== getValues('password')) {
                    return 'Passwords do not match';
                  }
                  return true;
                },
              })}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link component={RouterLink} href={CONFIG.EXTERNAL.TERMS} target={'_blank'}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link component={RouterLink} href={CONFIG.EXTERNAL.PRIVACY} target={'_blank'}>
                  Privacy Policy
                </Link>
              </Typography>
            }
          />
          {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            color={'primary'}
            variant="contained"
            loading={mRegister.isPending}
          >
            Sign up
          </Button>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign up with Google')}
            startIcon={<GoogleIcon />}
            disabled
          >
            Sign up with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign up with Facebook')}
            startIcon={<FacebookIcon />}
            disabled
          >
            Sign up with Facebook
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link
              component={RouterLink}
              href={PATHS.LOGIN}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
