// TODO: Imported toggle switch from flow bite. Delete this file
import React from 'react';


type ToggleSwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ className = '', ...props }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <input
        type="checkbox"
        id={props.id || 'cmn-toggle'}
        className="peer absolute -left-[9999px] invisible"
        {...props}
      />
      <label
        htmlFor={props.id || 'cmn-toggle'}
        className={`
          block relative cursor-pointer select-none
          w-16 h-8 rounded-full
          transition-colors duration-300 ease-in-out
          bg-gray-300 peer-checked:bg-blue-500
        `}
      >
        <span
          className={`
            absolute left-1 top-1
            w-6 h-6 bg-white rounded-full
            shadow-md
            transition-transform duration-300 ease-in-out
            transform
            translate-x-0
            peer-checked:translate-x-full
          `}
        />
      </label>
    </div>
  );
};

export default ToggleSwitch;