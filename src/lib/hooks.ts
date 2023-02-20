import { useEffect, useState } from "preact/hooks";
import { createBufferSource, play } from "./audio";
import { useAudioSamplerContext } from "./state/AudioSamplerProvider";

export const useAudioSampleLibrary = () => {
    // NOTE -- grab the library from the state
    const { dispatch, state: { samples, client } } = useAudioSamplerContext();

    useEffect(() => {
        (async () => {
            if (!client) return;

            // NOTE -- this could be better handled
            {
                const wavs = [
                    "/audio/kick01.wav",
                    "/audio/snare01.wav",
                    "/audio/hihat01.wav",
                    "/audio/clap01.wav",
                ];

                for (const wav of wavs) {
                    const resp = await fetch(wav);
                    const arrayBuffer = await resp.arrayBuffer();

                    const file = new File([arrayBuffer], wav.split("/").pop() ?? "sample.wav", {
                        type: "audio/wav",
                    });

                    client.addSample(file);
                }
            }

            for (const sample of await client.getSamples())
                dispatch({ type: "upload", payload: sample });
        })();
        // NOTE -- depending on an object may be a bad idea
    }, [client]);

    const uploadSample = async (e: DragEvent) => {
        e.preventDefault();
        if (!client) return;

        for (const file of [...(e.dataTransfer?.files ?? [])]) {
            const sample = await client.addSample(file);
            dispatch({ type: "upload", payload: sample });
        };
    };

    return { samples, uploadSample };
};

export const useAudioSamplePad = (name?: string) => {
    const { dispatch, state: { audioContext, client } } = useAudioSamplerContext();

    const [sampleName, setSampleName] = useState(name ?? "sample");

    const playSample = async () => {
        if (!client || !audioContext) return;

        const sample = await client.getSample(sampleName);
        // TODO -- if sample is undefined, throw an error & disable the button
        if (!sample) return;

        const arrayBuffer = await sample.file.arrayBuffer();

        const source = await createBufferSource(audioContext, arrayBuffer);

        play(source);
    };

    const uploadSample = async (e: DragEvent) => {
        e.preventDefault();

        if (!client) return;

        const files = [...(e.dataTransfer?.files ?? [])];
        if (!files.length) return;

        for (const file of files) {
            const sample = await client.addSample(file);
            dispatch({ type: "upload", payload: sample });
        };

        setSampleName(files[0].name.replace(/\.[^/.]+$/, ""));
    };


    return { sampleName, playSample, uploadSample };
};