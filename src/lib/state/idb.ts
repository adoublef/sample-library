import { openDB, DBSchema, IDBPDatabase } from "idb/with-async-ittr";

export type Sample = {
    name: string;
    file: File;
    size: number;
};

export type AudioSamplerSchema = DBSchema & {
    sample: SampleTable;
};

type SampleTable = {
    key: string;
    value: Sample;
    indexes: { "by-size": number; };
};

export function open({ dbName, version }: { dbName: string, version: number; }) {
    return openDB<AudioSamplerSchema>(dbName, version, {
        upgrade: (db, prev, curr, tx) => {
            console.log(`${db} upgraded from v${prev} to v${curr}`);

            if (db.objectStoreNames.contains("sample"))
                db.deleteObjectStore("sample");

            const store = db.createObjectStore("sample", { keyPath: "name" });
            store.createIndex("by-size", "size");
        }
    });
}

export class IDBAudioSamplerDatabase {
    constructor(private db: IDBPDatabase<AudioSamplerSchema>) { }

    close() { this.db.close(); }

    async addSample(file: File) {
        let sample = {
            name: file.name.replace(/\.[^/.]+$/, ""),
            size: file.size,
            file
        };

        const tx = this.db.transaction("sample", "readwrite");
        await Promise.all([tx.store.put(sample), tx.done]);

        return sample;
    }

    async getSample(name: string) {
        const tx = this.db.transaction("sample", "readonly");
        const [sample] = await Promise.all([tx.store.get(name), tx.done]);

        return sample;
    }

    async getSamples() {
        const tx = this.db.transaction("sample", "readonly");
        const [samples] = await Promise.all([tx.store.getAll(), tx.done]);

        return samples;
    }
}