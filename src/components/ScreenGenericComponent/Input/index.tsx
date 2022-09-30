import React, { InputHTMLAttributes } from 'react';
import style from './styles.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const Input:React.FC<InputProps> = ({ label, name, ...rest }: InputProps) => {
  return (
    <div className={style.inputblock}>
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} {...rest} />
    </div>
  );
}

export default Input;
