import rawProps from "./obj_props.json";

type RawProp = [string, number] | [string, number, string];
type Include =
    | string
    | {
          name: string;
          with?: string[];
          without?: string[];
      };
type RawNamespace = {
    [prop: string]: RawProp;
} & { $INCLUDE?: Include[] };

export type Prop = {
    id: number;
    type: string;
    note?: string;
};
export type Namespace = {
    [namespace: string]: Prop;
};

export type Props = {
    [namespace: string]: Namespace;
};

const getCollapsedProps = (rawProps: { [namespace: string]: RawNamespace }) => {
    console.log("get");
    let out: Props = {};

    const doInclude = (into: Namespace, inc: Include) => {
        let temp: Namespace = {};

        let incd = typeof inc == "string" ? { name: inc } : inc;

        addProps(temp, rawProps[incd.name]);
        for (let [k, v] of Object.entries(temp)) {
            if (
                (incd.with?.includes(k) ?? true) &&
                !(incd.without ?? []).includes(k)
            ) {
                into[k] = v;
            }
        }
    };

    const addProps = (into: Namespace, from: RawNamespace) => {
        from.$INCLUDE?.forEach(v => doInclude(into, v));

        for (let [k, v] of Object.entries(from)) {
            if (k == "$INCLUDE") {
                continue;
            }
            let [type, id, note] = v as RawProp;
            into[k] = { type, id, note };
        }
    };

    for (let [namespace, v] of Object.entries(rawProps)) {
        if (namespace.startsWith("$")) {
            continue;
        }
        out[namespace] = {};
        addProps(out[namespace], v);
    }

    return out;
};

export const PROPS = getCollapsedProps(rawProps as any);
