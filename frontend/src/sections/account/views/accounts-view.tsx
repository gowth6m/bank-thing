import type { AxiosResponse } from 'axios';
import type { BankTransactionsResponseDto } from 'src/services/types';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import InfoOutlineRoundedIcon from '@mui/icons-material/InfoOutlineRounded';
import {
  Card,
  Grid,
  Stack,
  Button,
  Select,
  Tooltip,
  MenuItem,
  CardHeader,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import ApiClient from 'src/services/api-client';

import { NoRowsOverlay, SkeletonLoadingOverlay } from 'src/components/table';

import AccountCard from '../components/account-card';
import AddAccountCard from '../components/add-account-card';
import AddBankAccountDialog from '../components/add-bank-account-dialog';
import { useInstitutionsContext } from '../context/institutions-context';
import { CompactTransactionChart } from '../components/transaction-stats-chart';

// ------------------------------------------------------------------------------

export default function AccountsView() {
  const router = useRouter();
  const pathname = usePathname();
  const addBankAccountDialog = useBoolean(false);
  const { institutions } = useInstitutionsContext();
  const [currency, setCurrency] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const searchParam = useSearchParams();
  const callback = searchParam.get('callback');

  // ------------------- API QUERIES -------------------

  const qAccounts = useQuery({
    queryKey: ['bank.getBankAccount'],
    queryFn: () => {
      return ApiClient.bank.getBankAccount();
    },
  });

  const qTransactions = useQuery<AxiosResponse<BankTransactionsResponseDto>, Error>({
    queryKey: ['bank.getAllTransactions', paginationModel.page, paginationModel.pageSize],
    queryFn: () =>
      ApiClient.bank.getAllTransactions(
        paginationModel.pageSize,
        paginationModel.page * paginationModel.pageSize
      ),
    placeholderData: (previousData) => previousData,
  });

  const qWeeklyStats = useQuery({
    queryKey: ['bank.getWeeklyStats'],
    queryFn: () => {
      return ApiClient.bank.getWeeklyStats(
        new Date(new Date().setDate(new Date().getDate() - 120)).toISOString(), // 120 days ago
        new Date().toISOString() // today
      );
    },
  });

  const accounts = useMemo(() => qAccounts.data?.data ?? [], [qAccounts.data]);
  const transactions = useMemo(() => qTransactions.data?.data?.data ?? [], [qTransactions.data]);
  const weeklyStats = useMemo(() => qWeeklyStats.data?.data ?? [], [qWeeklyStats.data]);

  // ------------------- DERIVED STATE -------------------

  const currencyOptions = useMemo(() => {
    const unique = [...new Set(accounts.map((a) => a.currency))];
    return unique.map((currency) => ({ value: currency, label: currency.toUpperCase() }));
  }, [accounts]);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + acc.balance, 0),
    [accounts]
  );

  const filteredAccounts = useMemo(
    () => accounts.filter((a) => a.currency === currency),
    [accounts, currency]
  );

  const recentTableData = useMemo(() => {
    return transactions.map((t) => ({
      id: t.id,
      date: fDateTime(t.date),
      toFrom: t.amount > 0 ? t.payeeDetails?.name : t.payerDetails?.name,
      amount: t.amount.toLocaleString('en-US', {
        style: 'currency',
        currency: t.currency,
      }),
      reference: t.reference,
      account: t.bankAccountId,
    }));
  }, [transactions]);

  // ------------------- EFFECTS -------------------

  useEffect(() => {
    if (!currency && accounts.length > 0) {
      setCurrency(accounts[0].currency);
    }
  }, [currency, accounts]);

  useEffect(() => {
    ApiClient.events.subscribeToSyncEvents((payload) => {
      if (payload.type === 'transactions-updated') {
        Promise.all([qAccounts.refetch(), qTransactions.refetch(), qWeeklyStats.refetch()]).then(
          () => {
            router.replace(pathname);
          }
        );
      }
    });
    return () => ApiClient.events.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------- RENDER -------------------

  const renderAccountSection = () => (
    <>
      <Stack direction="column" spacing={1} mb={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Total account balance ({filteredAccounts.length} accounts)</Typography>
          <Tooltip title="Total account balance for all linked accounts in the selected currency">
            <InfoOutlineRoundedIcon sx={{ width: 14, height: 14 }} />
          </Tooltip>
        </Stack>

        <Card variant="outlined" sx={{ width: 'fit-content', p: 0 }}>
          <Stack direction="row" alignItems="center" spacing={3} px={1} py={1}>
            <Select
              variant="standard"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              sx={{
                bgcolor: 'transparent',
                ':hover': { bgcolor: 'transparent' },
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
              }}
            >
              {currencyOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="h4">
              {totalBalance.toLocaleString('en-US', {
                style: 'currency',
                currency,
              })}
            </Typography>
          </Stack>
        </Card>
      </Stack>

      <Grid container spacing={2} mb={3}>
        {qAccounts.isLoading ? (
          <CircularProgress size={64} />
        ) : (
          <>
            {filteredAccounts.map((account) => (
              <Grid
                key={account.id}
                size={{
                  xs: 12,
                  md: 6,
                  lg: 3,
                }}
              >
                <AccountCard
                  institution={institutions.find((i) => i.id === account.institutionId)}
                  name={account.name}
                  balance={account.balance}
                  currency={account.currency}
                  accountType={account.accountType}
                  usageType={account.usageType}
                  accountId={account.id}
                  institutionId={account.institutionId}
                  updatedAt={account.updatedAt}
                />
              </Grid>
            ))}
            <Grid
              size={{
                xs: 12,
                md: 6,
                lg: 3,
              }}
            >
              <AddAccountCard onClick={addBankAccountDialog.onTrue} />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );

  const renderGraphs = () => {
    if (qWeeklyStats.isLoading) {
      return (
        <Stack alignItems="center" mb={3}>
          <CircularProgress size={64} />
        </Stack>
      );
    }

    if (transactions.length === 0 || weeklyStats.length === 0) return null;

    return (
      <Grid container spacing={2} mb={3}>
        {['OUT', 'IN'].map((dir) => (
          <Grid
            size={{
              xs: 12,
              md: 6,
              lg: 4,
            }}
            key={dir}
          >
            <Card sx={{ overflow: 'visible' }}>
              <Typography variant="subtitle2" fontWeight={700} px={2} py={1}>
                Money {dir.toLowerCase()}
              </Typography>
              <CompactTransactionChart stats={weeklyStats} direction={dir as any} />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <CardHeader
        title="Accounts"
        subheader="Add or manage your linked bank accounts."
        sx={{ my: 3 }}
        action={
          <>
            <IconButton
              size="small"
              color="primary"
              sx={{
                marginRight: 1,
              }}
            >
              <DownloadRoundedIcon />
            </IconButton>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={addBankAccountDialog.onTrue}
              startIcon={<AddRoundedIcon />}
            >
              Link bank account
            </Button>
          </>
        }
      />

      <AddBankAccountDialog
        open={addBankAccountDialog.value}
        onClose={addBankAccountDialog.onFalse}
        institutions={institutions}
      />

      {filteredAccounts.length > 0 ? (
        <>
          {renderAccountSection()}
          {renderGraphs()}
          <Card
            sx={{
              marginBottom: 3,
            }}
          >
            <CardHeader title="Recent transactions" sx={{ marginBottom: 2 }} />
            <DataGrid
              loading={qTransactions.isLoading || callback === 'connect-bank-account'}
              rows={recentTableData}
              columns={[
                { field: 'date', headerName: 'Date', flex: 2 },
                { field: 'toFrom', headerName: 'To/From', flex: 1 },
                { field: 'amount', headerName: 'Amount', flex: 1 },
                { field: 'reference', headerName: 'Reference', flex: 1 },
                { field: 'account', headerName: 'Account', flex: 1 },
              ]}
              pagination
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={qTransactions.data?.data.total ?? 0}
              pageSizeOptions={[5, 10, 25, 50]}
              disableColumnSelector
              rowSelection={false}
              density="compact"
              hideFooterSelectedRowCount
              slots={{ loadingOverlay: SkeletonLoadingOverlay, noRowsOverlay: NoRowsOverlay }}
              sx={{
                '--DataGrid-overlayHeight': `${36 * 5}px`,
                '& .MuiDataGrid-cell:focus': { outline: 'none' },
                '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.paper',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: 'none',
                  backgroundColor: 'background.paper',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                },
              }}
            />
          </Card>
        </>
      ) : (
        <Stack alignItems="center" justifyContent="center" spacing={1} my={3}>
          <AddAccountCard onClick={addBankAccountDialog.onTrue} />
        </Stack>
      )}
    </>
  );
}
