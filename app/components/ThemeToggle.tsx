'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@heroui/react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" isDisabled>
        <span className="w-4 h-4" />
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      className="transition-all duration-300"
    >
      {isDark ? (
        <span className="flex items-center gap-2">
          ☀️ <span className="hidden sm:inline">Light</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          🌙 <span className="hidden sm:inline">Dark</span>
        </span>
      )}
    </Button>
  );
}
