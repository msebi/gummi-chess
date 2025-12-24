import React from 'react';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';

type FadeInOnScrollProps = {
    children: React.ReactNode;
    className?: string;
};

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ children, className }) => {
    const { ref, inView } = useInView({
        // Trigger the animation once the element is in view
        triggerOnce: true,
        // Optional: set a threshold for when the animation should start
        threshold: 0.1,
    }); 

    return (
        <div
            ref={ref}
            className={clsx(
                'transition-all duration-700 ease-in-out',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10', // Animate from hidden to visible
                className // Allow passing additonal custom classes
            )}>
                {children}
        </div>
    );
};

export default FadeInOnScroll;
    