import { useRef } from 'react';

const useAudio = () => {
    const audioContext = useRef(new AudioContext()).current;

    const loadAudio = (file) => {
        return new Promise((resolve, reject) => {
            const audioSource = audioContext.createBufferSource();
            const reader = new FileReader();

            reader.onload = function(event) {
                const audioData = event.target.result;
                audioContext.decodeAudioData(audioData, function(buffer) {
                    audioSource.buffer = buffer;
                    resolve(audioSource);
                }, reject);
            };

            reader.readAsArrayBuffer(file);
        });
    };

    const playAudio = (audioSource) => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        audioSource.connect(audioContext.destination);
        audioSource.start();
    };

    return { loadAudio, playAudio };
};

export default useAudio;
