// import { red } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { CSSProperties } from '@mui/material/styles/createMixins';
import { alpha, createBreakpoints, createSpacing } from '@mui/system';

const shapeBorderRadiusBase = 5;
const spacing = 4;
const sp = createSpacing(spacing); // spacing helper
const bp = createBreakpoints({});
// Create a theme instance.
const themeCreator = (mode: PaletteMode) => {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    spacing,
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: {
              main: '#00FFEB',
            },
            secondary: {
              main: '#00e63e',
            },
            text: {
              primary: '#000000', // '#0e193c',
              secondary: '#767373',

              contrast: '#ffffff',
              active: '#00FFEB',
            },
            background: {
              dark: '#0e193c',
              darker: '#10172b',
              light: '#fafafa',
              lighter: '#f7f9ff',
              gray: '#fafafa',
              transparent: 'rgba(0,0,0,0.03)',
            },
          }
        : {
            primary: {
              main: '#00FFEB',
            },
            secondary: {
              main: '#00e63e',
            },
            success: {
              main: '#00D583',
            },
            text: {
              primary: '#ffffff', // '#0e193c',
              secondary: '#727682',
              contrast: '#CE0057',
              active: '#00FFEB', // *
              menu: '#9CA3AF',
            },
            background: {
              dark: '#0e193c',
              darker: '#12191F',
              main: '#002433',
              light: '#093143',
              lighter: '#f7f9ff',
              gray: '#fafafa',
              disabled: '#51595f',
              transparent: 'rgba(255,255,255,0.03)',
            },
          }),
    },
    typography: {
      fontFamily: 'Comfortaa, sans-serif',
      h1: {
        fontFamily: 'Comfortaa, sans-serif',
        fontSize: '2.5rem', // 40px
        lineHeight: '3.4375rem', // 55px
        fontWeight: 500,
      },
      h2: {
        fontFamily: 'Comfortaa, sans-serif',
        fontSize: '2.1875rem', // 35px
        lineHeight: '2.9375rem', // 47px
        fontWeight: 500,
      },
      h3: {
        fontFamily: 'Comfortaa, sans-serif',
        fontSize: '1.875rem', // 30px
        lineHeight: '2.5625rem', // 41px
        fontWeight: 500,
      },
      h4: {
        fontFamily: 'Comfortaa, sans-serif',
        fontSize: '1.5625rem', // 25px
        lineHeight: '2.125rem', // 34px
        fontWeight: 500,
      },
      h5: {
        fontFamily: 'Comfortaa, sans-serif',
        fontSize: '1.25rem', // 20px
        lineHeight: '1.6875rem', // 27px
        fontWeight: 500,
      },
      h6: {
        fontFamily: 'Comfortaa, sans-serif',
        fontSize: '1.125rem', // 18px
        lineHeight: '1.5rem', // 24px
        fontWeight: 500,
      },
      h7: {
        fontFamily: 'Comfortaa, sans-serif',
        fontSize: '1rem', // 16px
        lineHeight: '1.375rem', // 22px
        // fontWeight: 500,
      },
      'body-xl': {
        fontSize: '1.125rem', // 18px
        // fontSize: '1.25rem', // 20px
        lineHeight: 1.66,
      },
      'body-lg': {
        fontSize: '1.0625rem', // 17px
        lineHeight: 1.66,
      },
      'body-md': {
        fontSize: '1rem', // 16px
        lineHeight: 1.66,
      },
      body: {
        fontSize: '0.9375rem', // 15px
        lineHeight: 1.66,
      },
      'body-sm': {
        fontSize: '0.8125rem', // 13px
        lineHeight: 1.66,
      },
      'body-xs': {
        fontSize: '0.75rem', // 12px
        lineHeight: 1.66,
      },
      menu: {
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '0.75rem', // 12px
        lineHeight: '1.0625rem', // 17px
        // color: 'inherit',
      },
    },
    shape: {
      borderRadius: shapeBorderRadiusBase,
    },
  });

  theme.mixins = {
    ...theme.mixins,
    divider: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    radius: (multiplier: number) => ({ borderRadius: multiplier * +theme.shape.borderRadius }),
    border: {
      outlined: {
        border: `1px solid ${theme.palette.divider}`,
      },
      active: {
        border: `1px solid ${theme.palette.text.active}`,
      },
    },
  };
  theme.components = {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          min-height: 100%;
        }
        body {
          background: #ffffff;
          &.dark {
            background: #002433;
            background: linear-gradient(180deg, rgba(0,36,51,1) 0%, rgba(2,5,10,1) 50%, rgba(0,47,67,1) 100%) no-repeat;
          }
          font-family: Comfortaa, sans-serif;
        }
        #__next {
          min-height: 100%;
        }
        main {
          display: flex;
          flex-direction: column;
        }
        h1, h2, h3, h4, h5, h6 {
          padding: 0;
          margin: 0;
        }
        p, ol, ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        a {
          color: #00FFEB;
          text-decoration: none;
        }
        a:hover, a:focus, a:visited {
          color: inherit;
        }
        ::-webkit-scrollbar {
          width: 13px;
          height: 13px;
          background-color: #54636C;
        }
        ::-webkit-scrollbar-track {
          box-shadow: 'none';
          border-radius: 11px;
          // background-color: #54636C;
          -webkit-box-shadow: 'none';
        }
        ::-webkit-scrollbar-thumb {
          // border: 1px solid white;
          border-radius: 11px;
          background-color: #00FFEB;
        }
        .aria {
          border: 0;
          clip: rect(1px, 1px, 1px, 1px);
          clip-path: inset(50%);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          width: 1px;
          word-wrap: normal !important;
        }
        .aria:focus {
          background-color: #eee;
          clip: auto !important;
          clip-path: none;
          display: block;
          height: auto;
          left: 5px;
          padding: 15px 23px 14px;
          text-decoration: none;
          top: 5px;
          width: auto;
          z-index: 100000; /* Above WP toolbar. */
        }
        /* Grow Shadow  https://github.com/IanLunn/Hover/blob/master/css/hover.css*/
        .Awi-hoverGrow {
          transform: perspective(1px) translateZ(0);
          // transition: box-shadow, transform 0.3s !important;
          transition: transform 0.3s !important;
        }
        .Awi-hoverGrow:hover, .Awi-hoverGrow:focus, .Awi-hoverGrow:active {
          // box-shadow: 10px 15px 10px #B4BBC629;
          transform: scale(1.1);
        }
        @keyframes floating-v1 {
          0% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(20px, -20px);
          }
          66% {
            transform: translate(40px, 20px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
        .Mui-focusVisible {
          outline-offset: -2px;
          outline-width: 1;
          outline-color: #00FFEB;
          outline-style: auto;
        }
        .Awi-row {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      `,
    },
    MuiAppBar: {
      defaultProps: {
        position: 'static',
        color: 'transparent',
        elevation: 0,
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(6, 0),
          zIndex: 99,
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(12, 0),
          },
        },
      },
    },
    MuiToolbar: {
      defaultProps: {
        disableGutters: true,
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
      styleOverrides: {
        root: {
          paddingLeft: sp(4),
          paddingRight: sp(4),
          [bp.up('sm')]: {
            paddingLeft: sp(5),
            paddingRight: sp(5),
          },
          '&.MuiContainer-disableGutters': {
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          // color: theme.palette.text.primary,
          '&:hover': {
            color: theme.palette.text.active,
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variant: 'body',
        variantMapping: {
          'body-xl': 'p',
          'body-lg': 'p',
          'body-md': 'p',
          body: 'p',
          'body-sm': 'p',
          'body-xs': 'p',
          h7: 'h6',
          menu: 'p',
        },
      },
      variants: [
        {
          props: { variant: 'body-lg' },
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 400,
          },
        },
        {
          props: { variant: 'body-md' },
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 400,
          },
        },
        {
          props: { variant: 'body' },
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 400,
            maxWidth: 920,
            '&.MuiTypography-gutterBottom': {
              marginBottom: sp(7.5), // 30px
            },
          },
        },
        {
          props: { variant: 'body-sm' },
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 400,
          },
        },
        {
          props: { variant: 'body-xs' },
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 400,
          },
        },
        {
          props: { variant: 'h7' },
          style: {
            color: theme.palette.text.primary,
            '&.MuiTypography-gutterBottom': {
              marginBottom: sp(2.5), // 10px
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          overflowX: 'auto',
          overflowY: 'hidden',
          maxWidth: '100%',
          whiteSpace: 'pre-line',
          // maxWidth: 920,
          // marginRight: 'auto',
          // marginLeft: 'auto',
        },
        h1: {
          color: theme.palette.text.primary,
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(12.5), // 50px
          },
        },
        h2: {
          color: theme.palette.text.primary,
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(7.5), // 30px
          },
        },
        h3: {
          color: theme.palette.text.primary,
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(5), // 20px
          },
        },
        h4: {
          color: theme.palette.text.primary,
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(2.5), // 10px
          },
        },
        h5: {
          color: theme.palette.text.primary,
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(2.5), // 10px
          },
        },
        h6: {
          color: theme.palette.text.primary,
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(2.5), // 10px
          },
        },
        // body1: {
        //   // lineHeight: 2,
        //   maxWidth: 920,
        //   '&.MuiTypography-gutterBottom': {
        //     marginBottom: sp(7.5), // 30px
        //   },
        // },
        // body2: {
        //   maxWidth: 920,
        //   // color: theme.palette.text.secondary,
        //   '&.MuiTypography-gutterBottom': {
        //     marginBottom: sp(7.5), // 30px
        //   },
        // },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            color: '#002D40',
            background: ['rgb(0,255,235)', 'linear-gradient(115deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 50%)'],
            '&:hover': {
              color: '#002D40',
              background: ['rgb(0,255,235)', 'linear-gradient(115deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 90%)'],
              '@media (hover: none)': {},
            },
            '&.Mui-disabled': {
              background: theme.palette.background.disabled,
              color: theme.palette.text.secondary,
            },
          },
        },
        // {
        //   props: { variant: 'containedIcon' },
        //   style: {
        //     padding: theme.spacing(0, 0, 0, 9),
        //     borderRadius: shapeBorderRadiusBase * 8,
        //     overflow: 'hidden',
        //     color: theme.palette.text.contrast,
        //     '&:hover': {
        //       color: theme.palette.text.contrast,
        //       '& .MuiButton-endIcon': {
        //         transition: 'background-color .1s, transform .3s',
        //         transform: 'rotate(10deg)',
        //       },
        //     },
        //     '& .MuiButton-endIcon': {
        //       display: 'flex',
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       width: 54,
        //       height: 54,
        //       borderRadius: '100%',
        //       margin: theme.spacing(0, 0, 0, 4),
        //       transition: 'background-color .1s, transform .3s',
        //       svg: {
        //         fontSize: '32px',
        //       },
        //     },
        //   },
        // },
        // {
        //   props: { variant: 'containedIcon', color: 'primary' },
        //   style: {
        //     backgroundColor: theme.palette.primary.main,
        //     '&:hover': {
        //       backgroundColor: theme.palette.primary.dark,
        //       '@media (hover: none)': {
        //         backgroundColor: theme.palette.primary.main,
        //       },
        //       '& .MuiButton-endIcon': {
        //         backgroundColor: theme.palette.primary.main,
        //       },
        //     },
        //     '& .MuiButton-endIcon': {
        //       backgroundColor: theme.palette.primary.light,
        //     },
        //   },
        // },
        // {
        //   props: { variant: 'containedIcon', color: 'secondary' },
        //   style: {
        //     backgroundColor: theme.palette.secondary.main,
        //     '&:hover': {
        //       backgroundColor: theme.palette.secondary.dark,
        //       '@media (hover: none)': {
        //         backgroundColor: theme.palette.secondary.main,
        //       },
        //       '& .MuiButton-endIcon': {
        //         backgroundColor: theme.palette.secondary.main,
        //       },
        //     },
        //     '& .MuiButton-endIcon': {
        //       backgroundColor: theme.palette.secondary.light,
        //     },
        //   },
        // },
        // {
        //   props: { variant: 'containedIcon', color: 'info' },
        //   style: {
        //     backgroundColor: '#E6C301',
        //     '&:hover': {
        //       backgroundColor: '#b39700',
        //       '@media (hover: none)': {
        //         backgroundColor: '#E6C301',
        //       },
        //       '& .MuiButton-endIcon': {
        //         backgroundColor: '#E6C301',
        //       },
        //     },
        //     '& .MuiButton-endIcon': {
        //       backgroundColor: '#EDD032',
        //     },
        //   },
        // },
        // {
        //   props: { variant: 'containedIcon', color: 'success' },
        //   style: {
        //     backgroundColor: '#25AD64',
        //     '&:hover': {
        //       backgroundColor: '#1b894e',
        //       '@media (hover: none)': {
        //         backgroundColor: '#25AD64',
        //       },
        //       '& .MuiButton-endIcon': {
        //         backgroundColor: '#25AD64',
        //       },
        //     },
        //     '& .MuiButton-endIcon': {
        //       backgroundColor: '#36C377',
        //     },
        //   },
        // },
        // {
        //   props: { variant: 'inverted' },
        //   style: {
        //     borderRadius: shapeBorderRadiusBase * 8,
        //   },
        // },
        // {
        //   props: { variant: 'inverted', color: 'primary' },
        //   style: {
        //     color: theme.palette.primary.main,
        //     backgroundColor: theme.palette.common.white,
        //     '&:hover': {
        //       color: theme.palette.primary.dark,
        //       backgroundColor: theme.palette.common.white,
        //       '@media (hover: none)': {
        //         backgroundColor: theme.palette.common.white,
        //       },
        //     },
        //   },
        // },
        {
          props: { variant: 'outlined' },
          style: {
            // borderColor: 'currentcolor',
            borderWidth: 2,
            borderRadius: +theme.shape.borderRadius * 2,
            boxShadow: 'inset 10px 10px 6px #00000029',
            // color: theme.palette.text.primary,
            '&:hover': {
              borderWidth: 2,
              // color: theme.palette.text.primary,
            },
            '&.Mui-disabled': {
              borderWidth: 2,
              color: theme.palette.text.secondary,
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'info' },
          style: {
            padding: theme.spacing(0, 0, 0, 9),
            borderRadius: shapeBorderRadiusBase * 8,
            overflow: 'hidden',
            color: theme.palette.text.contrast,
            '&:hover': {
              border: '1px solid currentColor',
              color: theme.palette.text.contrast,
              '& .MuiButton-endIcon': {
                transition: 'background-color .1s, transform .3s',
                transform: 'rotate(10deg)',
              },
            },
            '& .MuiButton-endIcon': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 54,
              height: 54,
              border: '1px solid currentColor',
              borderRadius: '100%',
              margin: theme.spacing(0, '-1px', 0, 4),
              backgroundColor: '#ffad36',
              transition: 'background-color .1s, transform .3s',
              svg: {
                fontSize: '32px',
              },
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          minHeight: 'auto',
          borderRadius: 0,
          fontFamily: 'Comfortaa, sans-serif',
          lineHeight: 'initial',
          textTransform: 'none',
          [bp.up('sm')]: {
            whiteSpace: 'nowrap',
          },
          '&.Mui-disabled': {
            color: alpha(theme.palette.text.contrast, 0.5),
          },
        },
        contained: {
          color: theme.palette.text.contrast,
          borderRadius: shapeBorderRadiusBase * 2,
          '&:hover': {
            color: theme.palette.text.contrast,
          },
        },

        text: {
          padding: 0,
          minWidth: 0,
        },
        startIcon: {
          '&.MuiButton-iconSizeSmall': {
            marginRight: sp(5),
          },
          '&.MuiButton-iconSizeMedium': {
            marginRight: sp(6.5),
          },
        },
        iconSizeMedium: {
          '& svg': {
            fontSize: '2rem', // 32px
          },
        },
        sizeSmall: {
          padding: sp(3, 5),
          fontSize: '0.9375rem', // 15px
        },
        sizeMedium: {
          padding: sp(4.5, 7, 5),
          fontSize: '1rem', // 16px
          fontWeight: 600,
        },
        sizeLarge: {
          padding: sp(4.5, 9, 5),
          fontSize: '1.25rem', // 20
          fontWeight: 600,
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: 'Comfortaa, sans-serif',
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: +theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.transparent,
          '.MuiToggleButton-root': {
            padding: theme.spacing(3, 6),
            border: 0,
            ...theme.typography.body,
            fontSize: '1rem' /* 16px */,
            fontWeight: 400,
            textTransform: 'none',
            '&.Mui-selected': {
              color: theme.palette.text.active,
              backgroundColor: theme.palette.background.transparent,
            },
          },
          '.MuiToggleButtonGroup-grouped:not(:last-of-type), .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
            borderRadius: +theme.shape.borderRadius * 2,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 2,
        // square: true,
        // variant: "outlined",
        // raised: false,
      },
    },
    MuiCardHeader: {
      defaultProps: {
        // disableTypography: true,
      },
      styleOverrides: {
        root: {
          flexWrap: 'wrap',
          padding: sp(10, 8, 9, 14),
        },
        content: {
          padding: sp(2, 2.5, 0, 0),
        },
        action: {
          margin: 0,
        },
        title: {
          fontFamily: 'Comfortaa, sans-serif',
          fontSize: '1.5625rem', // 25px
          fontWeight: 700,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: sp(8, 7, 9),
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: sp(4, 13.5, 6.5, 14.5),
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: 'elevation',
      },
      styleOverrides: {
        rounded: {
          borderRadius: shapeBorderRadiusBase * 4,
        },
        elevation2: {
          boxShadow: '0 3px 6px #00000029',
        },
        elevation3: {
          boxShadow: '0 3px 6px #93939329',
        },
        elevation4: {
          boxShadow: '10px 10px 10px #B4BBC629',
        },
        elevation5: {
          boxShadow: '0px 30px 20px #93939329',
        },
        elevation6: {
          boxShadow: '10px 40px 10px #B4BBC629',
        },
        elevation7: {
          boxShadow: '10px 20px 40px #38383829',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          paddingLeft: sp(8),
        },
        input: {
          fontFamily: 'Comfortaa, sans-serif',
          fontSize: '1rem',
          fontWeight: 700,
          padding: sp(5, 8, 4.5, 2.5),
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
          color: '#939393',
          marginBottom: sp(4.5),
          // paddingLeft: sp(8),
        },
        // input: {
        //   fontFamily: 'Comfortaa, sans-serif',
        //   fontSize: '1rem',
        //   fontWeight: 700,
        //   padding: sp(5, 8, 4.5, 2.5),
        // },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          ...theme.typography.body,
          fontWeight: 500,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          ...theme.typography.body,
          position: 'absolute',
          bottom: -31,
        },
      },
    },
    MuiChip: {
      defaultProps: {
        variant: 'filled',
        color: 'secondary',
      },
      styleOverrides: {
        root: {
          height: 'auto',
          // border: 0,
          borderRadius: shapeBorderRadiusBase * 2,
        },
        outlined: {
          // minWidth: 145,
          // padding: sp(4, 7.5, 3),
        },
        filled: {
          // padding: sp(2, 5),
          // color: '#3881ED',
          // backgroundColor: '#e2f7ff',
          marginTop: 0,
          marginLeft: 0,
          boxShadow: '0 3px 6px #e8e8e829',
        },
        sizeSmall: {
          padding: theme.spacing(2.5, 3, 2),
        },
        sizeMedium: {
          padding: theme.spacing(4.5, 5, 4),
        },
        label: {
          // fontFamily: 'Open Sans, sans-serif',
          // fontSize: '1rem', // 16px
          fontSize: '0.875rem', // 14px
          lineHeight: '1.125rem', // 18px
          fontWeight: 700,
          color: theme.palette.text.contrast,
          // padding: 0,
        },
        labelSmall: {
          // fontFamily: 'inherit',
          // fontSize: '0.875rem', // 14px
          // fontWeight: 600,
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
        square: true,
      },
      styleOverrides: {
        root: {
          background: 'none',
          margin: theme.spacing(0, 0, 8),
          '&:before': {
            content: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: theme.spacing(5.5, 13, 4.5, 14),
          borderRadius: shapeBorderRadiusBase * 4,
          backgroundColor: theme.palette.background.transparent,
        },
        content: {
          alignItems: 'center',
          padding: 0,
          margin: 0,
          '&.Mui-expanded': {
            padding: 0,
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: theme.spacing(11, 12, 22.5),
          [theme.breakpoints.up('md')]: {
            padding: theme.spacing(11, 12, 22.5),
          },
        },
      },
    },
    // MuiPaginationItem: {
    //   styleOverrides: {
    //     root: {},
    //     text: {
    //       borderRadius: 0,
    //       fontSize: '25px', // 14px
    //       color: theme.palette.common.black,
    //       margin: theme.spacing(0, 5),
    //       '&.Mui-selected, &.Mui-selected:hover': {
    //         position: 'relative',
    //         backgroundColor: 'transparent',
    //         '&:after': {
    //           content: '""',
    //           position: 'absolute',
    //           bottom: 0,
    //           width: '100%',
    //           height: '4px',
    //           borderRadius: '4px',
    //           // backgroundColor: theme.palette.background.orange,
    //         },
    //       },
    //       '&:hover': {
    //         // color: theme.palette.background.orange,
    //         backgroundColor: 'transparent',
    //       },
    //     },
    //   },
    // },
    MuiTablePagination: {
      styleOverrides: {
        menuItem: {
          padding: theme.spacing(2.5, 4),
          ...theme.typography.menu,
          textAlign: 'center',
          color: theme.palette.text.menu,
          transition: 'color 200ms ease-in-out',
          '&:hover': {
            color: theme.palette.text.primary,
            transition: 'color 200ms ease-in-out',
          },
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            color: theme.palette.text.active,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          background: 'none',
          boxShadow: 'none',
          // padding: theme.spacing(9, 4, 7.5) },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '.MuiTableRow-root:last-of-type': {
            borderTop: `1px solid ${theme.palette.divider} !important`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 0,
          ...theme.typography.body,
          fontWeight: 500,
          // color: theme.palette.text.primary,
        },
        head: {
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        variant: 'menu',
        PaperProps: {
          square: true,
        },
      },
      styleOverrides: {
        paper: {
          border: `2px solid ${theme.palette.mode === 'dark' ? '#00ffeb' : 'transparent'}`,
          borderRadius: +theme.shape.borderRadius * 2,
        },
        list: {
          backgroundColor: theme.palette.background.light,
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableGutters: true,
        divider: true,
      },
      styleOverrides: {
        root: {
          padding: 0,
          '.MuiMenuItem-content': {
            padding: theme.spacing(5.5, 8),
            width: '100%',
            ...theme.typography.menu,
            color: theme.palette.text.menu,
            transition: 'color 200ms ease-in-out',
            '&:hover, &.active': {
              color: theme.palette.text.primary,
              transition: 'color 200ms ease-in-out',
            },
          },
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            '.MuiMenuItem-content, .MuiMenuItem-content:hover': {
              color: theme.palette.text.active,
            },
          },
        },
        dense: {
          '.MuiMenuItem-content': {
            padding: theme.spacing(2.5, 8),
          },
        },
        divider: {
          borderBottom: `2px solid ${theme.palette.mode === 'dark' ? '#217471' : theme.palette.divider}`,
          '&:last-of-type': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
            borderRadius: '6px',
          },
        },
      },
    },
    // MuiSvgIcon: {
    //   defaultProps: {
    //     color: 'primary',
    //   }
    // }
  };

  return theme;
};
// console.info(theme);

export default themeCreator;
