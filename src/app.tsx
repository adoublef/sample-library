import './app.css';
import AudioSampler from "./lib/components/AudioSampler";

export function App() {
    return (
        <AudioSampler dbName="audio-sampler" version={1} />
    );
}
