import { styled } from '@mui/material/styles';

import { useAppSelector } from '@/app/hooks';
import ConnectPanel from '@/components/general/ConnectPanel/ConnectPanel';
import Label from '@/components/general/Label/Label';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(() => ({}));

export default function InfoSection(/* { total }: Props */) {
  const t = usePageTranslation();
  const { connected } = useAppSelector((state) => ({
    connected: state.account.connected,
  }));

  return (
    <Root>
      <Panel header={<Label tooltip={t(`info-section.title-hint`)}>{t(`info-section.title`)}</Label>}>
        {connected ? <>TODO</> : <ConnectPanel back="/" />}
      </Panel>
    </Root>
  );
}
