import schema from "./schema.txt?raw";

export type SchemaType =
    | {
          type: "builtin";
          description: string;
      }
    | {
          type: "alias";
          of: string;
      }
    | {
          type: "enum";
          variants: { name: string; value: number }[];
      };

export type SchemaClassField = {
    name: string;
    id: number;
    type: string;
    note: string;
};
export type SchemaClass = {
    inherits: string[];
    fields: SchemaClassField[];
};

export type Schema = {
    types: Record<string, SchemaType>;
    classes: Record<string, SchemaClass>;
    defaultClass: string;
    idClasses: Record<number, string>;
};

const isIdentChar = (s: string) =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_".includes(
        s
    );
const isIntChar = (s: string) => "0123456789".includes(s);

type Token =
    | { type: "$" }
    | { type: "@" }
    | { type: "=" }
    | { type: "{" }
    | { type: "}" }
    | { type: ":" }
    | { type: "%" }
    | { type: "\n" }
    | { type: "#description"; value: string }
    | { type: "ident"; value: string }
    | { type: "number"; value: number };

const tokenize = (txt: string): Token[] => {
    let out: Token[] = [];
    let pos = 0;

    const skipWhitespace = () => {
        while (pos < txt.length && " \t\r".includes(txt[pos])) {
            pos += 1;
        }
    };
    skipWhitespace();
    while (pos < txt.length) {
        switch (txt[pos]) {
            case "$":
                out.push({ type: "$" });
                pos += 1;
                break;
            case "@":
                out.push({ type: "@" });
                pos += 1;
                break;
            case "=":
                out.push({ type: "=" });
                pos += 1;
                break;
            case "{":
                out.push({ type: "{" });
                pos += 1;
                break;
            case "}":
                out.push({ type: "}" });
                pos += 1;
                break;
            case ":":
                out.push({ type: ":" });
                pos += 1;
                break;
            case "%":
                out.push({ type: "%" });
                pos += 1;
                break;
            case "\n":
                out.push({ type: "\n" });
                pos += 1;
                break;
            case "#":
                pos += 1;
                let value = "";
                while (pos < txt.length && txt[pos] != "\n") {
                    value += txt[pos];
                    pos += 1;
                }
                out.push({ type: "#description", value: value.trim() });
                break;
            default:
                if (isIntChar(txt[pos]) || txt[pos] == "-") {
                    let value = "";
                    if (txt[pos] == "-") {
                        value = "-";
                        pos += 1;
                    }
                    while (pos < txt.length && isIntChar(txt[pos])) {
                        value += txt[pos];
                        pos += 1;
                    }
                    out.push({ type: "number", value: parseInt(value) });
                } else if (isIdentChar(txt[pos])) {
                    let value = "";
                    while (pos < txt.length && isIdentChar(txt[pos])) {
                        value += txt[pos];
                        pos += 1;
                    }
                    out.push({ type: "ident", value: value.trim() });
                } else {
                    throw `Unknown char: \`${txt[pos]}\``;
                }
        }
        skipWhitespace();
    }

    return out;
};

// this parser sucks ass dont worry about it
const parse = (txt: string): Schema => {
    let outSchema: Schema = {
        types: {},
        classes: {},
        defaultClass: "",
        idClasses: {},
    };

    let tokens = tokenize(txt);
    let pos = 0;

    const skipNewlines = () => {
        while (pos < tokens.length && tokens[pos].type == "\n") {
            pos += 1;
        }
    };
    const takeType = (typ: Token["type"]) => {
        let next = tokens[pos++];
        if (next.type != typ) {
            throw `Expected ${typ}`;
        }
    };
    const takeIdent = () => {
        let next = tokens[pos++];
        if (next.type != "ident") {
            throw "Expected identifier";
        }
        return next.value;
    };
    const takeNum = () => {
        let next = tokens[pos++];
        if (next.type != "number") {
            throw `Expected number`;
        }
        return next.value;
    };
    const takeDesc = () => {
        let next = tokens[pos++];
        if (next.type != "#description") {
            throw "Expected description";
        }
        return next.value;
    };

    skipNewlines();
    while (pos < tokens.length) {
        let start = tokens[pos++];
        switch (start.type) {
            case "$":
                let typeName = takeIdent();
                let next0 = tokens[pos++];
                switch (next0.type) {
                    case "#description":
                        outSchema.types[typeName] = {
                            type: "builtin",
                            description: next0.value,
                        };
                        break;
                    case "=":
                        let next1 = tokens[pos++];
                        switch (next1.type) {
                            case "{":
                                let variants: {
                                    name: string;
                                    value: number;
                                }[] = [];
                                skipNewlines();

                                let inc = 0;
                                let specifiedValues: Set<number> = new Set();

                                while (tokens[pos].type != "}") {
                                    let name = takeIdent();
                                    let maybeValue: number | null = null;
                                    if (tokens[pos].type == "=") {
                                        pos += 1;
                                        maybeValue = takeNum();
                                    }

                                    let value;
                                    if (maybeValue == null) {
                                        value = inc;
                                        inc += 1;
                                    } else {
                                        value = maybeValue;
                                        inc = value + 1;
                                    }
                                    if (specifiedValues.has(value)) {
                                        throw `Duplicate value ${value} for variant ${name} in enum ${typeName}`;
                                    }
                                    specifiedValues.add(value);

                                    variants.push({ name, value });
                                    skipNewlines();
                                }
                                pos += 1;

                                outSchema.types[typeName] = {
                                    type: "enum",
                                    variants,
                                };
                                break;
                            case "ident":
                                outSchema.types[typeName] = {
                                    type: "alias",
                                    of: next1.value,
                                };
                                break;
                            default:
                                throw "Expected name or enum definition";
                        }
                        break;
                    default:
                        throw "Expected `=` or description";
                }
                break;
            case "@":
                let className = takeIdent();
                let schemaClass: SchemaClass = { inherits: [], fields: [] };

                if (tokens[pos].type == ":") {
                    pos += 1;
                    while (tokens[pos].type != "\n") {
                        schemaClass.inherits.push(takeIdent());
                    }
                }
                if (pos < tokens.length) {
                    takeType("\n");
                }
                skipNewlines();

                while (pos < tokens.length && tokens[pos].type == "ident") {
                    let name = takeIdent();
                    let id = takeNum();
                    let type = takeIdent();
                    let note = "";
                    if (
                        pos < tokens.length &&
                        tokens[pos].type == "#description"
                    ) {
                        note = takeDesc();
                    }
                    schemaClass.fields.push({ name, id, type, note });
                    if (pos < tokens.length) {
                        takeType("\n");
                    }
                    skipNewlines();
                }
                outSchema.classes[className] = schemaClass;
                break;
            case "%":
                outSchema.defaultClass = takeIdent();
                skipNewlines();
                while (pos < tokens.length) {
                    let id = takeNum();
                    let idClass = takeIdent();
                    outSchema.idClasses[id] = idClass;
                    skipNewlines();
                }
                break;
            default:
                throw `Expected \`$\`, \`@\`, or \`%\`, found ${start.type}`;
        }
        skipNewlines();
    }

    return outSchema;
};

// let parsedSchema: Schema;
// try {

// }

console.log("bleeb");
export const SCHEMA: Schema = parse(schema);

export type FlatSchemaClass = {
    fields: SchemaClassField[];
};

export type FlatSchema = {
    types: Record<string, SchemaType>;
    classes: Record<string, FlatSchemaClass>;
    defaultClass: string;
    idClasses: Record<number, string>;
};

const flatFields = (cls: SchemaClass): SchemaClassField[] => {
    let out = [];
    for (let i of cls.inherits) {
        out.push(...flatFields(SCHEMA.classes[i]));
    }
    out.push(...cls.fields);
    return out;
};
let flatClasses: Record<string, FlatSchemaClass> = {};
for (let [name, cls] of Object.entries(SCHEMA.classes)) {
    flatClasses[name] = {
        fields: flatFields(cls),
    };
}

export const FLATTENED_SCHEMA: FlatSchema = {
    types: SCHEMA.types,
    defaultClass: SCHEMA.defaultClass,
    idClasses: SCHEMA.idClasses,
    classes: flatClasses,
};
