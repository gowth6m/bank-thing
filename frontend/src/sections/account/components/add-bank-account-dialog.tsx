import type { DialogProps } from '@mui/material';
import type { InstitutionDto } from 'src/services/types';

import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import {
  Box,
  Stack,
  Avatar,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import ApiClient from 'src/services/api-client';

// ----------------------------------------------------------------------

interface AddBankAccountDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  institutions: InstitutionDto[];
}

// ----------------------------------------------------------------------

export default function AddBankAccountDialog({
  open,
  onClose,
  institutions,
  ...props
}: AddBankAccountDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionDto | null>(null);

  const mConnectBankAccount = useMutation({
    mutationFn: () => {
      return ApiClient.bank.connectBankAccount({
        institutionId: selectedInstitution?.id || '',
        callbackUrl: `${window.location.origin}/accounts?callback=connect-bank-account`,
      });
    },
    onSuccess: (data) => {
      window.location.href = data.data.url;
      enqueueSnackbar('Redirecting to bank account connection', {
        variant: 'info',
      });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar('Failed to connect bank account', {
        variant: 'error',
      });
    },
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xs'} {...props}>
        <DialogTitle>Link bank account</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Select your bank from the list below to connect your account.
              </Typography>
              <Autocomplete
                options={institutions}
                value={selectedInstitution}
                onChange={(_, newValue) => setSelectedInstitution(newValue)}
                getOptionLabel={(option) => option.fullName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size={'small'}
                    fullWidth
                    placeholder={'Search for your bank...'}
                  />
                )}
                renderOption={(props, option) => {
                  const icon = option.media.find((m) => m.type === 'icon');

                  if (option.id !== 'modelo-sandbox') {
                    return (
                      <li
                        {...props}
                        key={option.id}
                        style={{
                          cursor: 'not-allowed',
                          pointerEvents: 'none',
                          opacity: 0.5,
                        }}
                      >
                        <Avatar
                          src={icon?.source}
                          alt={option.name}
                          sx={{ width: 24, height: 24, mr: 1 }}
                          variant="rounded"
                        />
                        {option.fullName} (not available)
                      </li>
                    );
                  }

                  return (
                    <li {...props} key={option.id}>
                      <Avatar
                        src={icon?.source}
                        alt={option.name}
                        sx={{ width: 24, height: 24, mr: 1 }}
                        variant="rounded"
                      />
                      {option.fullName}
                    </li>
                  );
                }}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    border: 'none',
                    bgcolor: 'transparent',
                    ':hover': {
                      border: 'none',
                      bgcolor: 'transparent',
                    },
                    ':focus': {
                      border: 'none',
                      bgcolor: 'transparent',
                    },
                  },
                  '& .MuiAutocomplete-clearIndicator': {
                    border: 'none',
                    bgcolor: 'transparent',
                    ':hover': {
                      border: 'none',
                      bgcolor: 'transparent',
                    },
                    ':focus': {
                      border: 'none',
                      bgcolor: 'transparent',
                    },
                  },
                }}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={mConnectBankAccount.isPending}
            sx={{
              mr: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              mConnectBankAccount.mutate();
            }}
            color="primary"
            variant="contained"
            loading={mConnectBankAccount.isPending}
          >
            {mConnectBankAccount.isPending ? 'Loading...' : 'Conitnue'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
