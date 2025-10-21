import objectsRaw from "./objects.csv?raw";

export const OBJECTS = objectsRaw
    .split("\n")
    .filter(v => v.length > 0)
    .map(line => {
        let [id, name] = line.split(",");
        return [parseInt(id), name] as [number, string];
    });
