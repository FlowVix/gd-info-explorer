<script lang="ts">
    import particleProps from "$lib/particle_props.json";
</script>

<svelte:head>
    <title>Particle Props</title>
</svelte:head>

<div class="w-full h-full flex flex-col gap-2">
    <span class="text-2xl">Particle Properties</span>
    <span class="text-[#9696E1]">
        <span
            >Custom particle objects have most of their settings in property id
            145, which is a long string of values separated by `a`.</span
        >
        <br />
        <span>These are the values in the order they appear in the string:</span
        >
    </span>
    <div class="overflow-y-scroll h-0 grow bg-[#1E1E2D] p-2 rounded-md">
        <div class="flex flex-col w-full">
            {#each particleProps as prop, i}
                <div class="w-full flex p-1 rounded-sm even:bg-[#28283C]">
                    <div class="min-w-[5%] max-w-[10%] text-[#FFDDCC]">
                        <span>{i}</span>
                    </div>
                    <div class="min-w-[5%] max-w-[10%] text-[#CCCCFF]">
                        <span>{prop}</span>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
