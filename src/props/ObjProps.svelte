<script lang="ts">
    import {
        PROPS,
        type Namespace,
        type Prop,
        FOUND_PROPS,
    } from "../props/props";
    import Highlighted from "./Highlighted.svelte";

    let search = "";

    let results: [string, [string, Prop][]][] = [];

    const updateResults = (search: string) => {
        let isNum = /^\d+$/.test(search);

        const containsSearch = (s: string) =>
            isNum ? false : s.toLowerCase().includes(search);

        results = [];

        for (let [name, v] of Object.entries(PROPS)) {
            let out: [string, Prop][] = [];
            for (let [propName, prop] of Object.entries(v)) {
                if (
                    containsSearch(propName) ||
                    containsSearch(name) ||
                    containsSearch(prop.type) ||
                    (isNum && prop.id == parseInt(search))
                ) {
                    out.push([propName, prop]);
                }
            }
            if (out.length != 0) {
                results.push([name, out]);
            }
        }
    };
    $: trimmedSearch = search.trim().toLowerCase();

    $: updateResults(trimmedSearch);

    const downloadJSON = () => {
        let jsonString = JSON.stringify(PROPS, null, 4);

        let blob = new Blob([jsonString], { type: "application/json" });

        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);

        a.download = "obj_props.json";

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
    };
</script>

<!-- <button>gaga</button> -->
<span class="text-2xl text-red-400 drop-shadow-md"
    >This is still very much a work in progress! 2.2 has just been released so
    I'm still finding property ids. If you find any mistakes, let me know on
    GitHub!</span
>
<span class="text-orange-200">Found {FOUND_PROPS} prop ids so far.</span>
<br />
<div class="flex justify-between">
    <div>
        <span>Search for property name, ID, or type</span><br />
        <input
            type="text"
            class="bg-gray-900 w-[400px] h-12 rounded-lg p-2 font-semibold text-xl my-2 drop-shadow-md"
            bind:value={search}
        />
    </div>
    <button
        class="bg-gray-700 hover:bg-gray-500 active:bg-gray-600 h-12 rounded-lg p-2 font-semibold text-xl my-2 drop-shadow-md"
        on:click={downloadJSON}>Download JSON</button
    >
</div>
<div class="flex flex-col gap-2 overflow-y-auto rounded-lg mt-2">
    <div
        class="flex justify-stretch h-full rounded-lg bg-gray-600 text-gray-300 p-2 pl-6 drop-shadow-md"
    >
        <div class="h-full flex-[2]">Property</div>
        <div class="h-full flex-1 text-blue-200">Value type</div>
        <div class="h-full flex-1 text-orange-200">Property ID</div>
        <div class="h-full flex-[2] text-gray-400">Note</div>
        <!--  -->
    </div>
    {#each results as [name, v]}
        <div class="flex flex-col rounded-lg bg-gray-700 p-2 drop-shadow-md">
            <span class="text-2xl mb-2"
                ><Highlighted text={name} search={trimmedSearch} /></span
            >

            <div
                class="flex flex-col h-full px-3 [&>*:nth-child(2n)]:bg-black/15"
            >
                {#each v as [name, { type, id, note }]}
                    <div
                        class="flex justify-stretch h-full text-gray-300 rounded-md pl-2"
                    >
                        <div class="h-full flex-[2]">
                            <Highlighted text={name} search={trimmedSearch} />
                        </div>
                        <div class="h-full flex-1 text-blue-200">
                            <Highlighted text={type} search={trimmedSearch} />
                        </div>
                        <div class="h-full flex-1 text-orange-200">
                            <Highlighted
                                text={`${id}`}
                                search={trimmedSearch}
                            />
                        </div>
                        <div class="h-full flex-[2] text-gray-400">
                            {note ?? ""}
                        </div>
                        <!--  -->
                    </div>
                {/each}
                <!--  -->
            </div>
        </div>
    {/each}
    <!--  -->
</div>
