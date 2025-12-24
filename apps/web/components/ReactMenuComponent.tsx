import React from 'react';
import Link from 'next/link'; // Import the Link component
// TODO: cleanup
// import Profile from './Profile';

// The vertical bar | you're seeing is not coming from the ReactHeaderComponent 
// itself. It's being rendered inside the ReactMenuComponent.
// The most likely reason is that the ReactMenuComponent is looping through 
// the menuItems and manually adding a | between each link. The modern and 
// cleaner way to handle this is to let Flexbox and Tailwind's gap or space-x 
// utilities manage the spacing, which avoids the need for a separator on the 
// last item.

interface MenuItem {
  label: string;
  href: string;
}

type ReactMenuComponentProps = {
  items: MenuItem[];
  className?: string;
};

const ReactMenuComponent: React.FC<ReactMenuComponentProps> = ({
  items,
  className = 'justify-end',
}) => {
  return (
    <nav className={`flex items-center ${className}`}>
      <ul className="flex items-center space-x-6 text-lg font-medium">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href}>
              <span className="cursor-pointer hover:text-blue-600 transition-colors">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ReactMenuComponent;