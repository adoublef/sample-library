import { IDBPDatabase } from "idb/with-async-ittr";
import { createContext, JSX } from "preact";
import { useContext, useEffect, useReducer } from "preact/hooks";
import { AudioSamplerSchema, IDBAudioSamplerDatabase, open, Sample } from "./idb";

export type AudioSamplerAction =
    | { type: "audiocontext"; payload: AudioContext; }
    | { type: "upload"; payload: Sample; }
    | { type: "connect"; payload: IDBPDatabase<AudioSamplerSchema>; }
    | { type: "disconnect"; };

type Dispatch = (action: AudioSamplerAction) => void;

const DispatchContext = createContext<Dispatch>(() => { });

export type AudioSamplerState = {
    audioContext?: AudioContext;
    client?: IDBAudioSamplerDatabase;
    samples: Pick<Sample, "name">[];
};

const StateContext = createContext<AudioSamplerState | null>(null);

export function useAudioSamplerContext() {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);

    if (!state) throw new Error("useAudioSamplerContext must be used within a AudioSamplerProvider");
    return { dispatch, state };
}


export function createAudioSamplerProvider(dbName: string, version: number, init: AudioSamplerState): (props: Pick<JSX.HTMLAttributes, "children">) => JSX.Element {
    return ({ children }) => {
        const [state, dispatch] = useReducer<AudioSamplerState, AudioSamplerAction>((state, action) => {
            switch (action.type) {
                case "connect":
                    const client = new IDBAudioSamplerDatabase(action.payload);
                    console.log("connected to db");
                    return { ...state, db: action.payload, client };
                case "disconnect":
                    state.client?.close();
                    return { ...state, db: undefined, client: undefined };
                case "audiocontext":
                    return { ...state, audioContext: action.payload };
                case "upload":
                    return { ...state, samples: [...state.samples, { name: action.payload.name }] };
                default:
                    return state;
            }
        }, init);

        useEffect(() => {
            (async () => {
                const db = await open({ dbName, version });
                dispatch({ type: "connect", payload: db });
            })();
            return () => dispatch({ type: "disconnect" });
        }, [dbName, version]);

        return (
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <div>{children}</div>
                </DispatchContext.Provider>
            </StateContext.Provider>
        );
    };
}