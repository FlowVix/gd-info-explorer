<script lang="ts">
    import { OBJECTS } from "$lib/objects";

    let search = $state("");
    let searchT = $derived(search.trim().toLowerCase());
</script>

<svelte:head>
    <title>Object IDs</title>
</svelte:head>

<div class="w-full h-full flex flex-col gap-2">
    <span class="text-2xl">Object IDs</span>
    <span class="text-[#9696E1]">
        <span>Massive credit to</span>
        <a
            class="text-bold underline"
            target="_blank"
            href="https://linktr.ee/Alphalaneous">Alphalaneous</a
        >
        <span>and the community for naming these!</span>
    </span>
    <input
        type="text"
        class="bg-[#0A0A0F] p-2 rounded-md w-[500px] placeholder:text-[#505078]"
        placeholder="Search for object name"
        bind:value={search}
    />
    <div class="overflow-y-scroll h-0 grow bg-[#1E1E2D] p-2 rounded-md">
        <div class="flex flex-col w-full">
            {#each OBJECTS as [id, name]}
                {#if name.toLowerCase().includes(searchT)}
                    <div class="w-full flex p-1 rounded-sm even:bg-[#28283C]">
                        <div class="min-w-[5%] max-w-[10%] text-[#FFDDCC]">
                            <span>{id}</span>
                        </div>
                        <div class="min-w-[95%] max-w-[10%] text-[#CCCCFF]">
                            <span>{name}</span>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>
