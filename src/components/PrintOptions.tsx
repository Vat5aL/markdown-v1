import React from 'react';

interface PrintOptionsProps {
  paperSize: string;
  orientation: string;
  fontSize: string;
  margins: string;
  singlePage: boolean;
  onPaperSizeChange: (size: string) => void;
  onOrientationChange: (orientation: string) => void;
  onFontSizeChange: (size: string) => void;
  onMarginsChange: (margins: string) => void;
  onSinglePageChange: (singlePage: boolean) => void;
  darkMode: boolean;
}

export const PrintOptions: React.FC<PrintOptionsProps> = ({
  paperSize,
  orientation,
  fontSize,
  margins,
  singlePage,
  onPaperSizeChange,
  onOrientationChange,
  onFontSizeChange,
  onMarginsChange,
  onSinglePageChange,
  darkMode,
}) => {
  const selectClass = `mr-2 p-2 rounded-lg ${
    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
  }`;

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <select value={paperSize} onChange={(e) => onPaperSizeChange(e.target.value)} className={selectClass}>
        <option value="a4">A4</option>
        <option value="letter">Letter</option>
        <option value="legal">Legal</option>
      </select>
      <select value={orientation} onChange={(e) => onOrientationChange(e.target.value)} className={selectClass}>
        <option value="portrait">Portrait</option>
        <option value="landscape">Landscape</option>
      </select>
      <select value={fontSize} onChange={(e) => onFontSizeChange(e.target.value)} className={selectClass}>
        <option value="small">Small</option>
        <option value="normal">Normal</option>
        <option value="large">Large</option>
      </select>
      <select value={margins} onChange={(e) => onMarginsChange(e.target.value)} className={selectClass}>
        <option value="0">No margins</option>
        <option value="1">Narrow</option>
        <option value="2">Normal</option>
        <option value="3">Wide</option>
      </select>
      <label className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        <input
          type="checkbox"
          checked={singlePage}
          onChange={(e) => onSinglePageChange(e.target.checked)}
          className="rounded"
        />
        Single page PDF
      </label>
    </div>
  );
};