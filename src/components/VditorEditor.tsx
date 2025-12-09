import { useEffect, useState, useId } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { uploadToMinio } from '../lib/upload';

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
  height = '300px',
}: VditorEditorProps) {
  const [vd, setVd] = useState<Vditor>();
  const editorId = `vditor-${useId().replace(/:/g, '-')}`;

  // Initialize Vditor
  useEffect(() => {
    let vditor: Vditor | undefined;

    const initVditor = new Vditor(editorId, {
      height,
      placeholder,
      theme: 'classic', // Fixed to light theme only
      mode: 'ir', // Instant rendering mode
      cache: {
        enable: false,
      },
      after: () => {
        // Set initial value after initialization
        initVditor.setValue(value);
        vditor = initVditor;
        setVd(initVditor);
      },
      input: (val) => {
        onChange(val);
      },
      upload: {
        url: '', // We handle upload manually
        handler: async (files: File[]) => {
          const response = await uploadToMinio(files);

          if (response.code === 0 && response.data.succMap) {
            const succMap = response.data.succMap;
            const markdown = Object.entries(succMap)
              .map(([filename, filepath]) => `![${filename}](${filepath})`)
              .join('\n');

            if (vditor) {
              vditor.insertValue(markdown);
            }
          } else {
            console.error('Upload failed:', response.msg);
            alert(`Upload failed: ${response.msg}`);
          }

          return null;
        },
      },
      preview: {
        theme: {
          current: 'light', // Fixed to light theme
        },
        hljs: {
          style: 'github', // Fixed to GitHub light style
        },
      },
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        '|',
        'line',
        'quote',
        'list',
        'ordered-list',
        'check',
        '|',
        'code',
        'inline-code',
        'insert-before',
        'insert-after',
        '|',
        'upload',
        'link',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'edit-mode',
        'both',
        'preview',
        'fullscreen',
      ],
    });

    // Clean up on unmount
    return () => {
      vditor?.destroy();
      setVd(undefined);
    };
  }, []); // Empty dependency array - only run once

  // Update value when prop changes
  useEffect(() => {
    if (vd && vd.getValue() !== value) {
      vd.setValue(value);
    }
  }, [value, vd]);

  return <div id={editorId} className="vditor" />;
}
