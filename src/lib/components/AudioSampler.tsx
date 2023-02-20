import { createAudioSamplerProvider } from "../state/AudioSamplerProvider";
import AudioSampleLibrary from "./AudioSampleLibrary";
import { AudioSamplePadContainer } from "./AudioSamplePad";

type AudioSamplerProps = {
    dbName: string;
    version: number;
};

export default function AudioSampler({ dbName, version }: AudioSamplerProps) {
    const AudioSamplerProvider = createAudioSamplerProvider(dbName, version, {
        samples: [],
        audioContext: new AudioContext()
    });

    return (
        <AudioSamplerProvider>
            <AudioSampleLibrary />
            <AudioSamplePadContainer />
        </AudioSamplerProvider>
    );
}
