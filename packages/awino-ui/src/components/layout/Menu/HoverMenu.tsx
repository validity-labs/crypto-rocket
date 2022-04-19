import * as React from 'react';

import {
  ButtonBase,
  ButtonBaseProps,
  ClickAwayListener,
  Grow,
  IconButton,
  IconButtonProps,
  MenuList,
  Paper,
  Popper as MuiPopper,
  PopperProps,
  SxProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrapFocus from '@mui/material/Unstable_TrapFocus';

const Root = styled('div')(({ theme }) => ({
  zIndex: 9999,
  '.AwiHoverMenu-toggle': {
    transition: 'color 300ms ease-in-out',
    '&[aria-expanded="true"]': {
      color: theme.palette.text.active,
      transition: 'color 300ms ease-in-out',
    },
  },

  '.MuiMenuItem-content': {
    padding: theme.spacing(4, 8),
    ...theme.typography.menu,
  },
}));

const Popper = styled(MuiPopper)(({ theme }) => ({
  '.AwiHoverMenu-paper': {
    border: `2px solid ${theme.palette.mode === 'dark' ? '#00ffeb' : 'transparent'}`,
    borderRadius: +theme.shape.borderRadius * 2,
    overflow: 'hidden',
    marginTop: theme.spacing(8),
  },
  '.AwiHoverMenu-list': {
    backgroundColor: theme.palette.background.light,
    padding: 0,
    overflow: 'hidden',
  },
}));

interface InjectedHoverMenuProps {
  close: (event: React.SyntheticEvent) => void;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  ariaLabel?: string;
  popperProps?: Partial<PopperProps>;
  popperSx?: SxProps;
  toggle: React.ReactNode;
  toggleProps?: IconButtonProps | ButtonBaseProps;
  toggleComponent?: typeof IconButton | typeof ButtonBase;
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
  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  const handleOpen = () => {
    setOpen(true);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    // if (event.key === 'Tab') {
    //   event.preventDefault();
    //   setOpen(false);
    // } else

    if (event.key === 'Escape') {
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

  // function handleToggleKeyDown(event: React.KeyboardEvent) {
  //   if (event.key === 'Space') {
  //     setOpen(true);

  //     event.preventDefault();
  //   }
  // }

  const toggleId = `${id}Toggle`;
  return (
    <Root onMouseLeave={handleLeave} {...restOfProps}>
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
        // onKeyDown={handleToggleKeyDown}
        // disableRipple
        className="AwiHoverMenu-toggle"
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
        // anchorOrigin={{
        //   vertical: 'bottom',
        //   horizontal: 'center',
        // }}
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'center',
        // }}
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
                <div>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id={id}
                      aria-labelledby={toggleId}
                      onKeyDown={handleListKeyDown}
                      className="AwiHoverMenu-list"
                      tabIndex={-1}
                    >
                      {children({ close: handleClose })}
                    </MenuList>
                  </ClickAwayListener>
                </div>
              </TrapFocus>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Root>
  );
}
