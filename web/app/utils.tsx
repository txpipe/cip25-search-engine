import React, { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function useOnScreen(callback: (onScreen: boolean) => void, element: HTMLElement | null) {
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observer.current = new IntersectionObserver(([entry]) =>
            callback(entry.isIntersecting)
        );
    }, [callback]);

    useEffect(() => {
        if (!observer.current || !element) return;

        observer.current.observe(element);

        return () => {
            if (!!observer.current) observer.current.disconnect();
        };
    }, [element]);
}

export function LazyMount(props: PropsWithChildren<{ className?: string, fallback?: React.ReactElement | null }>) {
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    const onScreen = useCallback((visible: boolean) => {
        if (mounted) return;
        setMounted(visible);
    }, [mounted]);

    useOnScreen(onScreen, containerRef);

    return (
        <div ref={setContainerRef} className={props.className}>
            {!mounted && (props.fallback || null)}
            {mounted && props.children}
        </div>
    );
}
