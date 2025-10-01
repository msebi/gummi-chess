// pages/test-page.tsx
import { useState } from 'react';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const TestToggleSwitch = () => {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Custom Toggle Switch</h1>
      
      <div className="flex items-center gap-4">
        <label htmlFor="my-toggle" className="font-medium text-gray-700">
          Flip Board
        </label>
        <ToggleSwitch
          id="my-toggle"
          checked={isToggled}
          onChange={(e) => setIsToggled(e.target.checked)}
        />
      </div>

      <p className="mt-4 text-lg">
        The switch is: <span className="font-bold">{isToggled ? 'ON' : 'OFF'}</span>
      </p>
    </div>
  );
};

export default TestToggleSwitch;