import { useAudioSamplePad } from "../hooks";
import { useAudioSamplerContext } from "../state/AudioSamplerProvider";

type SamplePadProps = {
    name?: string;
};

export default function AudioSamplePad(props: SamplePadProps) {
    const { sampleName, playSample, uploadSample } = useAudioSamplePad(props.name);

    return (
        <button
            onDrop={uploadSample}
            onDragOver={(e) => e.preventDefault()}
            onClick={playSample}
        >{sampleName}</button>
    );
}

export function AudioSamplePadContainer() {
    const { state: { samples } } = useAudioSamplerContext();

    return (
        <section>
            {samples.map(sample => (
                <AudioSamplePad name={sample.name} />
            ))}
        </section>
    );
}