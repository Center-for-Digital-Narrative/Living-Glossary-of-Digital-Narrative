<script lang="ts">
    import type { ColourType } from './types.ts';
    // Adapted from: https://codepen.io/natewiley/pen/GgONKy?editors=0100

    export let number = 45;
    export let color: ColourType = 'primary';
    export let delay = 0;
    export let size = 5.5;

    function randInt(min: number, max: number) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let particles = [...Array(number)].map((item, i) => ({
        z: randInt(0, 360),
        y: randInt(0, 360),
        color: `rgb(var(--color-${color}-${
            i < number / 3 ? '700' : i < (2 * number) / 3 ? '500' : '300'
        }))`
    }));
</script>

<div
        class="wrap overflow-hide"
        style={`
        --wrap-delay: ${delay}s;
        --particle-size: ${size}px;
    `}
>
    {#each particles as { z, color }, i}
        <div
                class="particle"
                style={`
                --rotate-z: ${z}deg;
                --animation-delay: ${0.01 * i}s;
                background-color: ${color};
            `}
        />
    {/each}
</div>

<style>
    :root {
        --orb-size-small: 180px;
        --orb-size: 240px;
        --orb-size-end: 600px;
        --particle-size: 3px;
        --time: 14s;
        --rotate-z: 1deg;
        --animation-delay: 0.1s;
        --wrap-delay: 0s;

        --color-primary-300: 79, 156, 228;
        --color-primary-500: 3, 113, 216;
        --color-primary-700: 2, 90, 173;
        --color-secondary-300: 88, 214, 240;
        --color-secondary-500: 16, 197, 234;
        --color-secondary-700: 13, 158, 187;
        --color-tertiary-300: 93, 231, 153;
        --color-tertiary-500: 24, 220, 109;
        --color-tertiary-700: 19, 176, 87;
        --color-success-300: 118, 214, 118;
        --color-success-500: 59, 196, 59;
        --color-success-700: 47, 157, 47;
        --color-warning-300: 239, 200, 93;
        --color-warning-500: 232, 176, 23;
        --color-warning-700: 186, 141, 18;
        --color-error-300: 255, 77, 154;
        --color-error-500: 255, 0, 111;
        --color-error-700: 204, 0, 89;
    }

    .wrap {
        position: relative;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        transform-style: preserve-3d;
        perspective: 1000px;
        animation: rotate var(--time) infinite linear;
        animation-delay: var(--wrap-delay);
    }

    .particle {
        position: absolute;
        width: var(--particle-size);
        height: var(--particle-size);
        border-radius: 50%;
        opacity: 0;
        animation: orbit var(--time) infinite;
        animation-delay: var(--animation-delay);
    }

    @keyframes rotate {
        /* 0% {
            transform: rotateX(45deg) rotateY(45deg);
        } */
        /* 100% {
            transform: rotateX(360deg) rotateY(360deg);
        } */
        100% {
            /* transform: rotateY(540deg) rotateX(540deg); */
            transform: rotateY(360deg) rotateX(360deg);
        }
    }

    @keyframes orbit {
        20% {
            opacity: 1;
        }
        30% {
            transform: rotateZ(var(--rotate-z)) translateX(var(--orb-size));
        }
        40% {
            transform: rotateZ(var(--rotate-z)) translateX(var(--orb-size-small));
        }
        50% {
            transform: rotateZ(var(--rotate-z)) translateX(var(--orb-size));
        }
        60% {
            transform: rotateZ(var(--rotate-z)) translateX(var(--orb-size-small));
        }
        70% {
            transform: rotateZ(var(--rotate-z)) translateX(var(--orb-size));
        }
        80% {
            transform: rotateZ(var(--rotate-z)) translateX(var(--orb-size-small));
            opacity: 1;
        }
        100% {
            transform: rotateZ(var(--rotate-z)) translateX(var(--orb-size-end));
        }
    }
</style>