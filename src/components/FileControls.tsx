import React, { useRef } from 'react';

interface FileControlsProps {
  onFileSelect: (file: File) => void;
  onLoadSample: () => void;
}

const FileControls: React.FC<FileControlsProps> = ({ onFileSelect, onLoadSample }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="controls">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.jsonl"
        onChange={handleFileChange}
      />
      <button onClick={onLoadSample}>Load Sample Data</button>
    </div>
  );
};

export default FileControls;
