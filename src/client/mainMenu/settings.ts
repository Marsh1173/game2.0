import { safeGetElementById } from "../util";

export function initSettingsButton(screenCover: HTMLElement) {
    var settingsDiv: HTMLElement = safeGetElementById("settingsDiv");
    var settingsOption: HTMLElement = safeGetElementById("settingsOption");
    safeGetElementById("settingsButton").onclick = () => {
        settingsOption.classList.add("selected");
        settingsDiv.style.display = "flex";
        screenCover.style.display = "block";

        screenCover.addEventListener("click", closeOptionsDiv);

        function closeOptionsDiv() {
            screenCover.removeEventListener("click", closeOptionsDiv);

            settingsDiv.style.display = "none";
            screenCover.style.display = "none";
            settingsOption.classList.remove("selected");
        }
    };
}

export function getSettingsConfig(): SettingsConfig {
    let particlePercent: number = Math.min(100, Math.max(0, (safeGetElementById("particleSlider") as HTMLInputElement).valueAsNumber));
    let followPercent: number = Math.min(100, Math.max(0, (safeGetElementById("screenDelay") as HTMLInputElement).valueAsNumber));
    let renderEffects: boolean = (safeGetElementById("effectsToggle") as HTMLInputElement).checked;
    let cameraShake: boolean = (safeGetElementById("cameraEffectsToggle") as HTMLInputElement).checked;

    return {
        renderEffects,
        cameraShake,
        particlePercent,
        followPercent,
    };
}

export interface SettingsConfig {
    renderEffects: boolean;
    cameraShake: boolean;
    particlePercent: number;
    followPercent: number;
}
