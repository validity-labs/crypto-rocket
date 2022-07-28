// import { red } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';
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
              secondary: '#ffffff',
              contrast: '#CE0057',
              active: '#00FFEB', // *
              menu: '#ffffff',
              disabled: '#9CA3AF',
            },
            divider: 'rgba(255,255,255,0.18)',
            background: {
              dark: '#002433',
              darker: '#12191F',
              main: '#00545F',
              light: '#207880',
              lighter: '#f7f9ff',
              gray: '#fafafa',
              disabled: '#51595f',
              transparent: 'rgba(255,255,255,0.1)',
              panel: '#207880',
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
              disabled: '#9CA3AF',
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
              panel: '#082938',
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
      'body-ms': {
        fontSize: '0.875rem', // 14px
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
    panel: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: +theme.shape.borderRadius * 5,
      backgroundColor: theme.palette.background.panel,
    },
  };
  theme.components = {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          min-height: 100%;
        }
        body {
          background: linear-gradient(180deg, #002433 0%, #207880 21%, #00545F 100%) no-repeat;
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
          outline-width: 2px;
          outline-color: #00FFEB;
          outline-style: solid;
        }
        .Awi-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          &.Awi-between {
            justify-content: space-between;
          }
          &.Awi-vStart {
            align-items: flex-start;
          }
          &.Awi-end {
            justify-content: flex-end;
          }
        }
        .Awi-column {
          display: flex;
          flex-direction: column;
        }
        .Awi-divider {
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        .Awi-fill {
          flex: 1;
        }
        .Awi-selectable {
          cursor: pointer;
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
          // '&:hover, &:focus': {
          //   color: theme.palette.text.active,
          // },
          // '&:visited': {
          //   color: theme.palette.text.primary,
          // },
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
          'body-ms': 'p',
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
          props: { variant: 'body-ms' },
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 400,
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
          // whiteSpace: 'pre-line',
          whiteSpace: 'normal',
          [theme.breakpoints.up('sm')]: {
            whiteSpace: 'pre-line',
          },
          // maxWidth: 920,
          // marginRight: 'auto',
          // marginLeft: 'auto',
        },
        h1: {
          color: theme.palette.text.primary,
          whiteSpace: 'pre-line',
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(12.5), // 50px
          },
        },
        h2: {
          color: theme.palette.text.primary,
          whiteSpace: 'pre-line',
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(7.5), // 30px
          },
        },
        h3: {
          color: theme.palette.text.primary,
          whiteSpace: 'pre-line',
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(5), // 20px
          },
        },
        h4: {
          color: theme.palette.text.primary,
          whiteSpace: 'pre-line',
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(2.5), // 10px
          },
        },
        h5: {
          color: theme.palette.text.primary,
          whiteSpace: 'pre-line',
          '&.MuiTypography-gutterBottom': {
            marginBottom: sp(2.5), // 10px
          },
        },
        h6: {
          color: theme.palette.text.primary,
          whiteSpace: 'pre-line',
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
            '& .MuiSvgIcon-fontSizeLarge': {
              fontSize: '30px',
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
        iconSizeLarge: {
          '& svg': {
            fontSize: '2rem', // 32px
          },
        },
        endIcon: {
          '> *:nth-of-type(1)': {
            '&.MuiSvgIcon-fontSizeLarge': {
              fontSize: '1.875rem', // 30px
            },
          },
        },
        sizeSmall: {
          padding: sp(3, 5),
          fontSize: '0.75rem', // 12px
          // fontSize: '0.9375rem', // 15px
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
            border: 0,
            ...theme.typography.body,
            fontSize: '1rem' /* 16px */,
            fontWeight: 400,
            textTransform: 'none',
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.text.active,
              backgroundColor: theme.palette.background.transparent,
            },
          },
          '.MuiToggleButtonGroup-grouped:not(:last-of-type), .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
            borderRadius: +theme.shape.borderRadius * 2,
          },
          '.MuiToggleButton-sizeMedium': {
            padding: theme.spacing(3, 6),
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
    MuiInputBase: {
      styleOverrides: {
        input: {
          minWidth: 60,
          height: 'auto',
          padding: 0,
          '&.Mui-disabled': {
            color: theme.palette.text.secondary,
            textFillColor: theme.palette.text.secondary,
          },
          '&::placeholder': {
            transition: '200ms ease-in',
            color: theme.palette.text.secondary,
          },
        },

        root: {
          padding: theme.spacing(3, 3.5, 3, 7),
          borderRadius: +theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.transparent,
          '&.Mui-focused, &:focus, &:hover, &[aria-expanded="true"]': {
            boxShadow: `0px 0 3px 1px ${theme.palette.primary.main}`,
          },
        },
        sizeSmall: {
          padding: theme.spacing(1.5, 3.5, 1.5, 7),
          ...theme.typography['body-sm'],
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // fontSize: '1rem',
          // fontWeight: 600,
          // color: '#939393',
          // marginBottom: sp(4.5),
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
          // '& .MuiFormLabel-root': {
          //   ...theme.typography.body,
          //   fontWeight: 500,
          //   color: theme.palette.text.secondary,
          //   '&.Mui-focused': {
          //     color: theme.palette.text.primary,
          //   },
          // },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          // position: 'relative',
        },
        label: {
          marginBottom: theme.spacing(1),
          ...theme.typography.body,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.text.primary,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          marginBottom: theme.spacing(1),
          ...theme.typography.body,
          fontWeight: 500,
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.text.primary,
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          ...theme.typography.body,
          // position: 'absolute',
          // bottom: -31,
          display: ['block', '-webkit-box'],
          maxWidth: '100%',
          margin: theme.spacing(1),
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
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
          // color: theme.palette.text.contrast,
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
        selectIcon: {
          color: theme.palette.text.primary,
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
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'collapse',
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
          backgroundColor: 'transparent', // theme.palette.background.light,
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
          border: '2px solid #00ffeb',
          borderRadius: +theme.shape.borderRadius * 2,
        },
        list: {
          backgroundColor: theme.palette.background.light,
          padding: 0,
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
    MuiTooltip: {
      styleOverrides: {
        popper: {
          whiteSpace: 'pre-line',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          padding: theme.spacing(4, 8),
          borderRadius: +theme.shape.borderRadius * 7,
          boxShadow: '0px 3px 6px #00000029',
          // backgroundColor: theme.palette.background.transparent,
        },
        icon: {
          marginRight: theme.spacing(7),
        },
        message: {
          ...theme.typography.body,
          fontWeight: 500,
        },
        standardError: {
          backgroundColor: alpha(theme.palette.error.main, 0.1),
        },
        standardInfo: {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        standard: {
          display: 'flex',
          alignItems: 'center',
          paddingTop: `${theme.spacing(4.5)} !important`,
          paddingRight: `${theme.spacing(15.5)} !important`,
          paddingBottom: theme.spacing(4.5),
          paddingLeft: theme.spacing(9),
          // margin: 0,
          '.MuiSelect-value': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          },
          '&.MuiInputBase-inputSizeSmall': {
            paddingTop: `${theme.spacing(3)} !important`,
            paddingRight: `${theme.spacing(13.5)} !important`,
            paddingBottom: theme.spacing(3),
            paddingLeft: theme.spacing(7),
            '.MuiSelect-value': {
              ...theme.typography['body-sm'],
            },
          },
          // padding: theme.spacing(1, 7),
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
          overflow: 'auto',
        },
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          minWidth: 120,
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          ...theme.typography['body'],
          fontWeight: 600,
          color: theme.palette.text.primary,
        },
      },
    },
  };

  return theme;
};
// console.info(theme);

export default themeCreator;
