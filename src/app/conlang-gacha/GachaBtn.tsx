import { useFormStatus } from 'react-dom';
import style from './GachaBtn.module.css';

interface Props {}

const GachaBtn = ({}: Props) => {
  return (
    <button type='submit' className='btn-theme-1'>
      回す！
    </button>
  );
};

export default GachaBtn;
