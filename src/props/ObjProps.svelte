<script lang="ts">
    import {
        PROPS,
        type Namespace,
        type Prop,
        FOUND_PROPS,
    } from "../props/props";
    import Highlighted from "./Highlighted.svelte";

    import particleProps from "./paticle_props.json";

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

    enum Popup {
        PARTICLE_PROPS,
    }

    let popup: Popup | null = null;
</script>

<!-- <button>gaga</button> -->
<span class="text-2xl text-red-400 drop-shadow-md"
    >This is still a work in progress! Main things missing are related to shader
    triggers. If you find any mistakes, let me know on GitHub!</span
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
    <div class="flex gap-4">
        <button
            class="bg-gray-700 hover:bg-gray-500 active:bg-gray-600 h-12 rounded-lg p-2 font-semibold text-xl my-2 drop-shadow-md"
            on:click={() => (popup = Popup.PARTICLE_PROPS)}
            >Particle Properties</button
        ><button
            class="bg-gray-700 hover:bg-gray-500 active:bg-gray-600 h-12 rounded-lg p-2 font-semibold text-xl my-2 drop-shadow-md"
            on:click={downloadJSON}>Download JSON</button
        >
    </div>
</div>
<div class="flex flex-col gap-2 overflow-y-auto rounded-lg mt-2">
    <div
        class="flex justify-stretch h-full rounded-lg bg-gray-700 text-gray-300 p-2 pl-6 drop-shadow-md"
    >
        <div class="h-full flex-[2]">Property</div>
        <div class="h-full flex-1 text-blue-200">Value type</div>
        <div class="h-full flex-1 text-orange-200">Property ID</div>
        <div class="h-full flex-[4] text-gray-400">Note</div>
        <!--  -->
    </div>
    {#each results as [name, v]}
        <div class="flex flex-col rounded-lg bg-gray-700 p-2 drop-shadow-md">
            <span class="text-2xl mb-2"
                ><Highlighted text={name} search={trimmedSearch} /></span
            >

            <div
                class="flex flex-col h-full px-3 [&>*:nth-child(2n+1)]:bg-black/15"
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
                        <div class="h-full flex-[4] text-gray-400">
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
{#if popup != null}
    <div
        class="absolute left-0 top-0 w-screen h-screen bg-black/50 backdrop-blur-xl flex justify-center items-center"
    >
        <div
            class="bg-gray-800 w-3/4 h-3/4 rounded-lg border-2 border-gray-500 shadow-xl flex flex-col items-center justify-between p-4 gap-4"
        >
            <div class="overflow-y-auto w-full">
                {#if popup == Popup.PARTICLE_PROPS}
                    Custom particle objects have most of their settings in
                    property id 145, which is a long string of values separated
                    by `a`.
                    <br />
                    These are the values in the order they appear in the string:
                    <br />
                    <br />
                    <div class="flex flex-col items-center">
                        {#each particleProps as prop, i}
                            <div class="flex w-full gap-4">
                                <span class="text-gray-500 w-20 text-right"
                                    >{i}.</span
                                >
                                <span class="text-gray-300">{prop}</span>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
            <button
                class="bg-gray-700 hover:bg-gray-500 active:bg-gray-600 h-12 rounded-lg p-2 font-semibold text-xl drop-shadow-md"
                on:click={() => (popup = null)}>Close</button
            >
        </div>
        <!--  -->
    </div>
{/if}
