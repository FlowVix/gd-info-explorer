<script lang="ts">
    import { PROPS, type Namespace, type Prop } from "../props/props";
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
</script>

<!-- <button>gaga</button> -->
<span class="text-2xl text-red-400 drop-shadow-md"
    >This is still very much a work in progress! 2.2 has just been released so
    I'm still finding property ids. If you find any mistakes, let me know on
    GitHub!</span
><br />
<span>Search for property name or ID</span>
<input
    type="text"
    class="bg-gray-900 w-[400px] h-12 rounded-lg p-2 font-semibold text-xl my-2 drop-shadow-md"
    bind:value={search}
/>
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

            <div class="flex flex-col h-full pl-5">
                {#each v as [name, { type, id, note }]}
                    <div class="flex justify-stretch h-full text-gray-300">
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
