import * as React from 'react';

import { ButtonUnstyled, ButtonUnstyledProps } from '@mui/base';
import {
  BoxProps,
  ClickAwayListener,
  Grow,
  IconButton,
  IconButtonProps,
  Paper,
  Popper as MuiPopper,
  PopperProps,
  SxProps,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrapFocus from '@mui/material/Unstable_TrapFocus';

const Root = styled(Box)(({ theme }) => ({
  zIndex: theme.zIndex.appBar,
  '.AwiHoverMenu-toggle': {
    border: 0,
    boxShadow: 'none',
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    transition: 'color 300ms ease-in-out',
    cursor: 'pointer',
    '&[aria-expanded="true"]': {
      color: theme.palette.text.active,
    },
  },
}));

const Popper = styled(MuiPopper)(({ theme }) => ({
  '.AwiHoverMenu-paper': {
    marginTop: theme.spacing(4),
    border: '2px solid #00ffeb',
    borderRadius: +theme.shape.borderRadius * 2,
    overflow: 'hidden',
  },
  '.AwiHoverMenu-list': {
    padding: 0,
    backgroundColor: theme.palette.background.light,
    '> .AwiHoverMenu-item': {
      borderBottom: `2px solid ${theme.palette.mode === 'dark' ? '#217471' : theme.palette.divider}`,
      '&:last-of-type, &.Awi-reset': {
        borderBottom: 0,
      },
    },
  },
}));

interface InjectedHoverMenuProps {
  close: (event: React.SyntheticEvent) => void;
}

interface Props extends BoxProps {
  id: string;
  ariaLabel?: string;
  popperProps?: Partial<PopperProps>;
  popperSx?: SxProps;
  toggle: React.ReactNode;
  toggleProps?: IconButtonProps | ButtonUnstyledProps;
  toggleComponent?: typeof IconButton | typeof ButtonUnstyled;
  children(props: InjectedHoverMenuProps): React.ReactNode;
}

export default function HoverMenu({
  id,
  ariaLabel,
  toggle,
  toggleProps,
  toggleComponent,
  popperProps,
  popperSx,
  children,
  ...restOfProps
}: Props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const ToggleButton = toggleComponent ? toggleComponent : IconButton;

  const handleOpen = () => {
    setOpen(true);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    // if (event.key === 'Tab') {
    //   setOpen(false);
    // } else

    if (event.key === 'Escape') {
      event.stopPropagation();
      setOpen(false);
    }
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  // const prevOpen = React.useRef(open);
  // React.useEffect(() => {
  //   if (prevOpen.current === true && open === false) {
  //     anchorRef.current!.focus();
  //   }

  //   prevOpen.current = open;
  // }, [open]);

  const handleLeave = () => {
    handleClose(null);
  };

  const toggleId = `${id}Toggle`;
  return (
    <Root onMouseLeave={handleLeave} tabIndex={-1} {...restOfProps}>
      {/* @ts-ignore */}
      <ToggleButton
        ref={anchorRef}
        id={toggleId}
        size="small"
        aria-label={ariaLabel}
        aria-controls={open ? id : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        className="AwiHoverMenu-toggle"
        // disableRipple
        {...toggleProps}
      >
        {toggle}
      </ToggleButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom"
        transition
        disablePortal
        onMouseLeave={handleClose}
        {...popperProps}
        sx={popperSx}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'center top',
            }}
          >
            <Paper className="AwiHoverMenu-paper">
              <TrapFocus open>
                <Box tabIndex={-1}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <ul id={id} aria-labelledby={toggleId} className="AwiHoverMenu-list" onKeyDown={handleListKeyDown}>
                      {children({ close: handleClose })}
                    </ul>
                  </ClickAwayListener>
                </Box>
              </TrapFocus>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Root>
  );
}
