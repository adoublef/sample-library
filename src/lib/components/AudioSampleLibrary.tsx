import { useAudioSampleLibrary } from "../hooks";

export default function AudioSampleLibrary() {
    const { samples, uploadSample } = useAudioSampleLibrary();

    return (
        <div
            onDrop={uploadSample}
            onDragOver={e => e.preventDefault()}
        >
            <h1>Sample Library</h1>
            <ul>
                {samples.map(sample => (
                    <li>{sample.name}</li>
                ))}
            </ul>
        </div>
    );
}


