export const createBufferSource = async (audioContext: AudioContext, arrayBuffer: ArrayBuffer) => {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return new AudioBufferSourceNode(audioContext, { buffer: audioBuffer });
};

export const play = async (source: AudioBufferSourceNode) => {
    source.connect(source.context.destination);
    source.start();
};