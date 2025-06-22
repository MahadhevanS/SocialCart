'use client';

import { Leaf } from 'lucide-react';
import { useMemo } from 'react';

const LEAF_COUNT = 20; // Increased for a more dramatic effect

export function LeafFall() {
  const leaves = useMemo(() => {
    return Array.from({ length: LEAF_COUNT }).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 3 + 5}s`, // 5s to 8s duration
        animationDelay: `${Math.random() * 3}s`, // start at different times
      };
      const size = Math.random() * 20 + 20; // 20px to 40px
      return (
        <div key={i} className="leaf" style={style}>
          <Leaf style={{ width: size, height: size, opacity: Math.random() * 0.5 + 0.5 }} />
        </div>
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {leaves}
    </div>
  );
}
