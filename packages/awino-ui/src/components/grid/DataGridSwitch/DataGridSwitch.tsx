import { PlainSwitch } from '@/components/general/Switch/Switch';

interface DataGridSwitchProps {
  value: boolean;
  callback: (newValue: boolean) => void;
}

const DataGridSwitch = ({ value, callback }: DataGridSwitchProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    callback(newValue);
  };
  return <PlainSwitch checked={value} onChange={handleChange} />;
};

export default DataGridSwitch;
