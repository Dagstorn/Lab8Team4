import React from 'react';
import { Transition } from 'react-transition-group';

interface Props {
    children: React.ReactNode
    show: boolean
}
// define animation duration for dynamic content of the page
const duration = 500;

// define styles for animation
const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}
// react-transition-group provides 4 states for animation, and we define sttles for all 4 states
const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

// Wrapper component that will provide fade in effect transition
const FadeTransition: React.FC<Props> = ({ children, show }) => {
    return (
        < Transition in={show} timeout={duration}>
            {(state: any) => (
                <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    {children}
                </div>
            )}
        </Transition>
    );
};

export default FadeTransition;