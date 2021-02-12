import { useEffect, RefObject } from 'react';

// inspired from https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

export default function useClickOutsideListener(
  ref: RefObject<HTMLElement>,
  cb: () => void,
) {
  useEffect(() => {
    /**
     * Trigger cb if clicked outside of component
     */
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node | null)) {
        cb();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, cb]);
}
