<script lang="ts">
    import { SCHEMA, FLATTENED_SCHEMA } from "$lib/schema";
    import type { Snippet } from "svelte";

    let typeElems: Record<string, HTMLDivElement> = $state({});
    let focusedType: string | null = $state(null);

    let propSearch = $state("");
    let propSearchT = $derived(
        propSearch.trim().split(/ +/).join("").toLowerCase()
    );

    let idSearch = $state("");
    let idSearchT = $derived.by(() => {
        let parsed = parseInt(idSearch.trim());
        if (isNaN(parsed)) {
            return null;
        }
        return parsed;
    });

    const downloadJson = (value: any, name: string) => {
        let jsonString = JSON.stringify(value, null, 4);

        let blob = new Blob([jsonString], { type: "application/json" });

        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);

        a.download = name;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
    };
    // let idSearchT =
    // let propSearch = $state("");
</script>

<svelte:head>
    <title>Object Props</title>
</svelte:head>

{#snippet columned(name: Snippet, id: Snippet, type: Snippet, note: Snippet)}
    <div class="w-full flex p-1 rounded-sm">
        <div class="min-w-[30%] max-w-[30%]">
            {@render name()}
        </div>
        <div class="min-w-[10%] max-w-[10%]">
            {@render id()}
        </div>
        <div class="min-w-[20%] max-w-[20%]">
            {@render type()}
        </div>
        <div class="min-w-[40%] max-w-[40%]">
            {@render note()}
        </div>
    </div>
{/snippet}

<div class="w-full h-full flex flex-col items-start gap-4">
    <div class="flex gap-2">
        <button
            class="bg-[#3C3C5A] hover:bg-[#505078] p-1 rounded-md cursor-pointer"
            onclick={() => downloadJson(SCHEMA, "schema.json")}
            >Download Original JSON</button
        >
        <button
            class="bg-[#3C3C5A] hover:bg-[#505078] p-1 rounded-md cursor-pointer"
            onclick={() => downloadJson(FLATTENED_SCHEMA, "flat_schema.json")}
            >Download Flattened JSON</button
        >
    </div>
    <div class="w-full grow flex justify-center items-center gap-4">
        <div
            class="min-w-[calc(70%-8px)] max-w-[calc(70%-8px)] h-full flex flex-col gap-2"
        >
            <div class="flex mb-2 items-end gap-2">
                <span class="text-2xl">Property Classes</span>
                <span class="text-lg text-[#505078]"
                    >(structured divisions of properties I made up)</span
                >
            </div>
            <div class="flex gap-2 items-center">
                <input
                    type="text"
                    class="bg-[#0A0A0F] p-2 rounded-md w-[300px] placeholder:text-[#505078]"
                    placeholder="Search for property name, ID, or type"
                    bind:value={propSearch}
                    oninput={() => {
                        idSearch = "";
                    }}
                />
                <input
                    type="text"
                    class="bg-[#0A0A0F] p-2 rounded-md w-[300px] placeholder:text-[#505078]"
                    placeholder="Search for class by object ID"
                    bind:value={idSearch}
                    oninput={() => {
                        propSearch = "";
                    }}
                />
                <span class="text-[#9696E1]"
                    >Property 1 is Object ID and corresponds to one of these
                    classes</span
                >
            </div>
            <div
                class="w-full bg-[#1E1E2D] px-2 py-1 rounded-md flex flex-col overflow-y-scroll"
                style="
                scrollbar-color: transparent transparent;
            "
            >
                {#snippet name()}
                    <span class="text-[#CCCCFF]">Property</span>
                {/snippet}
                {#snippet id()}
                    <span class="text-[#FFDDCC]">ID</span>
                {/snippet}
                {#snippet type()}
                    <span class="text-[#CEDEFF]">Type</span>
                {/snippet}
                {#snippet note()}
                    <span class="text-[#AAAAFF]">Note</span>
                {/snippet}
                {@render columned(name, id, type, note)}
            </div>
            <div
                class="w-full bg-transparent rounded-lg grow overflow-y-scroll overflow-x-hidden flex flex-col gap-2 h-0"
            >
                {#each [...Object.entries(SCHEMA.classes)] as [name, cls], idx}
                    {@const nameIncludes = name
                        .toLowerCase()
                        .includes(propSearchT)}
                    {@const matchingFields = nameIncludes
                        ? cls.fields
                        : cls.fields.filter(
                              field =>
                                  field.name
                                      .toLowerCase()
                                      .includes(propSearchT) ||
                                  field.type
                                      .toLowerCase()
                                      .includes(propSearchT) ||
                                  field.id.toString() == propSearchT
                          )}
                    {@const classVisible =
                        idSearchT == null
                            ? propSearchT.length == 0 || nameIncludes
                                ? true
                                : matchingFields.length > 0
                            : SCHEMA.idClasses[idSearchT] == null
                              ? name == SCHEMA.defaultClass
                              : SCHEMA.idClasses[idSearchT] == name}
                    <div
                        class="w-full bg-[#1E1E2D] p-2 rounded-md flex-col {classVisible
                            ? 'flex'
                            : 'hidden'}"
                    >
                        <div class="flex justify-between mb-1">
                            <span class="text-xl font-bold">{name}</span>
                            <span
                                >{#if cls.inherits.length > 0}
                                    <span class="text-[#9696E1] text-lg"
                                        >inherits</span
                                    >
                                {/if}
                                <span class="text-[#9696E1] text-lg font-bold"
                                    >{cls.inherits.join(", ")}</span
                                ></span
                            >
                        </div>
                        {#each cls.fields as field}
                            {#snippet name()}
                                <span class="text-[#CCCCFF]">{field.name}</span>
                            {/snippet}
                            {#snippet id()}
                                <span class="text-[#FFDDCC]">{field.id}</span>
                            {/snippet}
                            {#snippet type()}
                                <button
                                    class="text-[#CEDEFF] underline cursor-pointer"
                                    onclick={() => {
                                        typeElems[field.type].scrollIntoView({
                                            block: "center",
                                        });
                                        focusedType = field.type;
                                    }}>{field.type}</button
                                >
                            {/snippet}
                            {#snippet note()}
                                <span class="text-[#AAAAFF]">{field.note}</span>
                            {/snippet}
                            {#if matchingFields.findIndex(sfield => sfield.name == field.name) != -1}<div
                                    class="odd:bg-[#28283C]"
                                >
                                    {@render columned(name, id, type, note)}
                                </div>{/if}
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
        <div
            class="min-w-[calc(30%-8px)] max-w-[calc(30%-8px)] h-full flex flex-col gap-2"
        >
            <span class="text-2xl mb-2">Property Types</span>
            <div
                class="w-full bg-transparent rounded-lg grow overflow-y-scroll overflow-x-hidden flex flex-col gap-2 h-0"
                style="
            scrollbar-color: white #0A0A0F;
            "
            >
                {#each [...Object.entries(SCHEMA.types)] as [name, type]}
                    <div
                        class="w-full bg-[#1E1E2D] p-2 rounded-md flex flex-col border-2 {focusedType ==
                        name
                            ? 'border-amber-200'
                            : 'border-transparent'}"
                        {@attach e => {
                            typeElems[name] = e;
                        }}
                    >
                        <div class="flex justify-between">
                            <span class="text-xl font-bold">{name}</span>
                            <span class="text-[#9696E1] font-bold"
                                >{type.type}</span
                            >
                        </div>
                        {#if type.type == "builtin"}
                            <span class="text-[#9696E1]"
                                >{type.description}</span
                            >
                        {:else if type.type == "alias"}
                            <span class="text-[#9696E1]"
                                ><span>alias for</span>
                                <span class="font-bold">{type.of} </span></span
                            >
                        {:else if type.type == "enum"}
                            <div class="flex text-[#9696E1] gap-2">
                                <div class="flex flex-col">
                                    {#each type.variants as variants}
                                        <span>{variants.name}</span>
                                    {/each}
                                </div>
                                <div class="flex flex-col">
                                    {#each type.variants as variants}
                                        <span>= {variants.value}</span>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
