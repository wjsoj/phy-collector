'use client';

interface AlertProps {
  message: string;
  onClose: () => void;
}

export function ErrorAlert({ message, onClose }: AlertProps) {
  return (
    <div className="glass rounded-lg p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">Error</h3>
            <p className="text-red-700 dark:text-red-300 mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function SuccessAlert({ message, onClose }: AlertProps) {
  return (
    <div className="glass rounded-lg p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 shadow-lg glow-blue">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">Success</h3>
            <p className="text-green-700 dark:text-green-300 mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
