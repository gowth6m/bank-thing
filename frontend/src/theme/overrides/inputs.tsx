import type { Theme, Components } from '@mui/material/styles';

import { alpha } from '@mui/material/styles';
import { svgIconClasses } from '@mui/material/SvgIcon';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';

export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: 'border-box',
        transition: 'all 100ms ease-in',
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: '2px',
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&.Mui-disabled': {
          cursor: 'not-allowed',
          pointerEvents: 'auto',
        },
        boxShadow: 'none',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: 'none',
        variants: [
          {
            props: {
              size: 'small',
            },
            style: {
              height: '2.25rem',
              padding: '8px 12px',
            },
          },
          {
            props: {
              size: 'medium',
            },
            style: {
              height: '2.5rem', // 40px
            },
          },
          // {
          //   props: {
          //     color: 'primary',
          //     variant: 'contained',
          //   },
          //   style: {
          //     color: 'white',
          //     backgroundColor: theme.palette.grey[900],
          //     backgroundImage: `linear-gradient(to bottom, ${theme.palette.grey[700]}, ${theme.palette.grey[800]})`,
          //     boxShadow: `inset 0 1px 0 ${theme.palette.grey[600]}, inset 0 -1px 0 1px hsl(220, 0%, 0%)`,
          //     border: `1px solid ${theme.palette.grey[700]}`,
          //     '&:hover': {
          //       backgroundImage: 'none',
          //       backgroundColor: theme.palette.grey[700],
          //       boxShadow: 'none',
          //     },
          //     '&:active': {
          //       backgroundColor: theme.palette.grey[800],
          //     },
          //     ...theme.applyStyles('dark', {
          //       color: 'black',
          //       backgroundColor: theme.palette.grey[50],
          //       backgroundImage: `linear-gradient(to bottom, ${theme.palette.grey[100]}, ${theme.palette.grey[50]})`,
          //       boxShadow: 'inset 0 -1px 0  hsl(220, 30%, 80%)',
          //       border: `1px solid ${theme.palette.grey[50]}`,
          //       '&:hover': {
          //         backgroundImage: 'none',
          //         backgroundColor: theme.palette.grey[300],
          //         boxShadow: 'none',
          //       },
          //       '&:active': {
          //         backgroundColor: theme.palette.grey[400],
          //       },
          //     }),
          //   },
          // },
          // {
          //   props: {
          //     color: 'secondary',
          //     variant: 'contained',
          //   },
          //   style: {
          //     color: 'white',
          //     backgroundColor: theme.palette.primary[300],
          //     backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.primary[400], 0.8)}, ${theme.palette.primary[500]})`,
          //     boxShadow: `inset 0 2px 0 ${alpha(theme.palette.primary[200], 0.2)}, inset 0 -2px 0 ${alpha(theme.palette.primary[700], 0.4)}`,
          //     border: `1px solid ${theme.palette.primary[500]}`,
          //     '&:hover': {
          //       backgroundColor: theme.palette.primary[700],
          //       boxShadow: 'none',
          //     },
          //     '&:active': {
          //       backgroundColor: theme.palette.primary[700],
          //       backgroundImage: 'none',
          //     },
          //   },
          // },
          {
            props: {
              variant: 'outlined',
            },
            style: {
              color: (theme.vars || theme).palette.text.primary,
              border: '1px solid',
              borderColor: theme.palette.grey[200],
              backgroundColor: alpha(theme.palette.grey[50], 0.3),
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
                borderColor: theme.palette.grey[300],
              },
              '&:active': {
                backgroundColor: theme.palette.grey[200],
              },
              ...theme.applyStyles('dark', {
                backgroundColor: theme.palette.grey[800],
                borderColor: theme.palette.grey[700],

                '&:hover': {
                  backgroundColor: theme.palette.grey[900],
                  borderColor: theme.palette.grey[600],
                },
                '&:active': {
                  backgroundColor: theme.palette.grey[900],
                },
              }),
            },
          },
          {
            props: {
              color: 'secondary',
              variant: 'outlined',
            },
            style: {
              color: theme.palette.primary[700],
              border: '1px solid',
              borderColor: theme.palette.primary[200],
              backgroundColor: theme.palette.primary[50],
              '&:hover': {
                backgroundColor: theme.palette.primary[100],
                borderColor: theme.palette.primary[400],
              },
              '&:active': {
                backgroundColor: alpha(theme.palette.primary[200], 0.7),
              },
              ...theme.applyStyles('dark', {
                color: theme.palette.primary[50],
                border: '1px solid',
                borderColor: theme.palette.primary[900],
                backgroundColor: alpha(theme.palette.primary[900], 0.3),
                '&:hover': {
                  borderColor: theme.palette.primary[700],
                  backgroundColor: alpha(theme.palette.primary[900], 0.6),
                },
                '&:active': {
                  backgroundColor: alpha(theme.palette.primary[900], 0.5),
                },
              }),
            },
          },
          {
            props: {
              variant: 'text',
            },
            style: {
              color: theme.palette.grey[600],
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
              },
              '&:active': {
                backgroundColor: theme.palette.grey[200],
              },
              ...theme.applyStyles('dark', {
                color: theme.palette.grey[50],
                '&:hover': {
                  backgroundColor: theme.palette.grey[700],
                },
                '&:active': {
                  backgroundColor: alpha(theme.palette.grey[700], 0.7),
                },
              }),
            },
          },
          {
            props: {
              color: 'secondary',
              variant: 'text',
            },
            style: {
              color: theme.palette.primary[700],
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary[100], 0.5),
              },
              '&:active': {
                backgroundColor: alpha(theme.palette.primary[200], 0.7),
              },
              ...theme.applyStyles('dark', {
                color: theme.palette.primary[100],
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary[900], 0.5),
                },
                '&:active': {
                  backgroundColor: alpha(theme.palette.primary[900], 0.3),
                },
              }),
            },
          },
        ],
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightMedium,
        letterSpacing: 0,
        color: (theme.vars || theme).palette.text.primary,
        border: '1px solid ',
        borderColor: theme.palette.grey[200],
        backgroundColor: alpha(theme.palette.grey[50], 0.3),
        '&:hover': {
          backgroundColor: theme.palette.grey[100],
          borderColor: theme.palette.grey[300],
        },
        '&:active': {
          backgroundColor: theme.palette.grey[200],
        },
        '&.Mui-disabled': {
          cursor: 'not-allowed',
          pointerEvents: 'auto',
        },
        ...theme.applyStyles('dark', {
          backgroundColor: theme.palette.grey[800],
          borderColor: theme.palette.grey[700],
          '&:hover': {
            backgroundColor: theme.palette.grey[900],
            borderColor: theme.palette.grey[600],
          },
          '&:active': {
            backgroundColor: theme.palette.grey[900],
          },
        }),
        variants: [
          {
            props: {
              size: 'small',
            },
            style: {
              width: '2.25rem',
              height: '2.25rem',
              padding: '0.25rem',
              [`& .${svgIconClasses.root}`]: { fontSize: '1rem' },
            },
          },
          {
            props: {
              size: 'medium',
            },
            style: {
              width: '2.5rem',
              height: '2.5rem',
            },
          },
        ],
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '10px',
        boxShadow: `0 4px 16px ${alpha(theme.palette.grey[400], 0.2)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: theme.palette.primary[500],
        },
        ...theme.applyStyles('dark', {
          [`& .${toggleButtonGroupClasses.selected}`]: {
            color: '#fff',
          },
          boxShadow: `0 4px 16px ${alpha(theme.palette.primary[700], 0.5)}`,
        }),
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '12px 16px',
        textTransform: 'none',
        borderRadius: '10px',
        fontWeight: 500,
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[400],
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          [`&.${toggleButtonClasses.selected}`]: {
            color: theme.palette.primary[300],
          },
        }),
      }),
    },
  },
  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: <CheckBoxOutlineBlankRoundedIcon sx={{ color: 'hsla(210, 0%, 0%, 0.0)' }} />,
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: '1px solid ',
        borderColor: alpha(theme.palette.grey[300], 0.8),
        boxShadow: '0 0 0 1.5px hsla(210, 0%, 0%, 0.04) inset',
        backgroundColor: alpha(theme.palette.grey[100], 0.4),
        transition: 'border-color, background-color, 120ms ease-in',
        '&:hover': {
          borderColor: theme.palette.primary[300],
        },
        '&.Mui-focusVisible': {
          outline: `2px solid ${alpha(theme.palette.primary[500], 0.5)}`,
          outlineOffset: '2px',
          borderColor: theme.palette.primary[400],
        },
        '&.Mui-checked': {
          color: 'white',
          backgroundColor: theme.palette.primary[500],
          borderColor: theme.palette.primary[500],
          boxShadow: `none`,
          '&:hover': {
            backgroundColor: theme.palette.primary[600],
          },
        },
        ...theme.applyStyles('dark', {
          borderColor: alpha(theme.palette.grey[700], 0.8),
          boxShadow: '0 0 0 1.5px hsl(210, 0%, 0%) inset',
          backgroundColor: alpha(theme.palette.grey[900], 0.8),
          '&:hover': {
            borderColor: theme.palette.primary[300],
          },
          '&.Mui-focusVisible': {
            borderColor: theme.palette.primary[400],
            outline: `2px solid ${alpha(theme.palette.primary[500], 0.5)}`,
            outlineOffset: '2px',
          },
        }),
      }),
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: 'none',
      },
      input: ({ theme }) => ({
        '&::placeholder': {
          opacity: 0.7,
          color: theme.palette.grey[500],
        },
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        padding: 0,
      },
      root: ({ theme }) => ({
        padding: '8px 12px',
        color: (theme.vars || theme).palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        backgroundColor: (theme.vars || theme).palette.background.default,
        transition: 'border 120ms ease-in',
        '&:hover': {
          borderColor: theme.palette.grey[400],
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `2px solid ${alpha(theme.palette.primary[500], 0.5)}`,
          borderColor: theme.palette.primary[400],
        },
        ...theme.applyStyles('dark', {
          '&:hover': {
            borderColor: theme.palette.grey[500],
          },
        }),
        variants: [
          {
            props: {
              size: 'small',
            },
            style: {
              height: '2.25rem',
            },
          },
          {
            props: {
              size: 'medium',
            },
            style: {
              height: '2.5rem',
            },
          },
        ],
      }),
      notchedOutline: {
        border: 'none',
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars || theme).palette.grey[500],
        ...theme.applyStyles('dark', {
          color: (theme.vars || theme).palette.grey[400],
        }),
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        marginBottom: 8,
      }),
    },
  },
};
