'use client';

import { useEffect, useState, useRef, useId } from 'react';
import { useTheme } from 'next-themes';
import type { UploadResponse } from '@/types';

interface VditorEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export default function VditorEditor({
  value,
  onChange,
  placeholder = 'Please enter content...',
  height = '400px',
}: VditorEditorProps) {
  const [vd, setVd] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const editorId = `vditor-${reactId.replace(/:/g, '-')}`;
  const vditorRef = useRef<any>(null);

  // Ensure client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Vditor
  useEffect(() => {
    if (!isClient) return;

    let instance: any = null;
    let isMounted = true;

    const initVditor = async () => {
      try {
        const Vditor = (await import('vditor')).default;

        if (!isMounted || !containerRef.current) return;

        const currentTheme = resolvedTheme || theme || 'light';

        instance = new Vditor(editorId, {
          minHeight: parseInt(height),
          placeholder,
          theme: currentTheme === 'dark' ? 'dark' : 'classic',
          mode: 'ir',
          cache: { enable: false },
          toolbar: [
            'emoji',
            'headings',
            'bold',
            'italic',
            'strike',
            '|',
            'list',
            'ordered-list',
            'check',
            '|',
            'code',
            'inline-code',
            'quote',
            '|',
            'table',
            'link',
            'upload',
            '|',
            'undo',
            'redo',
          ],
          preview: {
            theme: {
              current: currentTheme === 'dark' ? 'dark' : 'light',
            },
            hljs: {
              style: currentTheme === 'dark' ? 'monokai' : 'github',
            },
            math: {
              engine: 'KaTeX',
              inlineDigit: false,
              macros: {},
            },
            markdown: {
              mathBlockPreview: true,
              codeBlockPreview: true,
            },
          },
          upload: {
            url: '/api/upload',
            max: 10 * 1024 * 1024,
            multiple: true,
            accept: 'image/*',
            fieldName: 'files',
            success(editor: HTMLElement, responseText: string) {
              try {
                const response = JSON.parse(responseText) as UploadResponse;
                if (response.code === 0 && response.data.succMap && vditorRef.current) {
                  // 使用 Vditor 实例的 insertValue 方法插入图片
                  Object.entries(response.data.succMap).forEach(([filename, url]) => {
                    const imageMarkdown = `![${filename}](${url})\n`;
                    vditorRef.current.insertValue(imageMarkdown);
                  });
                }
              } catch (error) {
                console.error('Upload success handler error:', error);
              }
            },
          },
          input: (val: string) => {
            onChange(val);
          },
          after: () => {
            if (isMounted) {
              instance.setValue(value || '');
              setVd(instance);
              vditorRef.current = instance;
              setMounted(true);
            }
          },
        });
      } catch (error) {
        console.error('Failed to initialize Vditor:', error);
      }
    };

    initVditor();

    return () => {
      isMounted = false;
      if (instance?.destroy) {
        try {
          instance.destroy();
        } catch (e) {
          console.error('Error destroying Vditor:', e);
        }
      }
    };
  }, [isClient, theme, resolvedTheme, editorId, height, placeholder]); // Re-initialize on theme change

  // Update value when prop changes
  useEffect(() => {
    if (vd && mounted && value !== vd.getValue()) {
      vd.setValue(value);
    }
  }, [value, vd, mounted]);

  return (
    <div ref={containerRef} className="w-full">
      {!isClient || !mounted ? (
        <div
          className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center"
          style={{ height }}
        >
          <span className="text-gray-500 dark:text-gray-400">Loading editor...</span>
        </div>
      ) : null}
      {isClient && <div id={editorId} className="vditor-container" style={{ display: mounted ? 'block' : 'none' }} />}
    </div>
  );
}
