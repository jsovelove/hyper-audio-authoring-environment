import React, {useState} from 'react';
import { useDropzone } from 'react-dropzone';

const dropzoneStyles = {
  padding: '20px',
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  width: '200px',
  position: 'fixed',
  bottom: '10px', 
  right: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  textAlign: 'center',
};

const AudioDropzone = ({ onAudioFilesReceived }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'audio/*',
    onDrop: (acceptedFiles) => {
      onAudioFilesReceived(acceptedFiles);
    },
  });

  return (
    <div {...getRootProps()} style={dropzoneStyles}>
      <input {...getInputProps()} />
      <p>Drag & drop audio files here, or click to select files</p>
    </div>
  );
};

export default AudioDropzone;
