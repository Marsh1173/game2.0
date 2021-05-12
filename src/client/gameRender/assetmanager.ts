import { DoodadType } from "../../objects/terrain/doodads/doodad";
import { ServerTalker } from "../servertalker";

export type AbilityImageName = "slashIcon" | "whirlwindIcon" | "emptyIcon" | "lvl10" | "lvl6" | "stabIcon" | "lungeIcon" | "swingIcon" | "poundIcon";
export type WeaponImageName = "berserkerSword2";

export type ImageName = DoodadType | AbilityImageName | WeaponImageName;

//let img: HTMLImageElement = assetManager.images["lavafly"];

export const imageInformation: Record<ImageName, string> = {
    rockLarge: `http://${ServerTalker.hostName}/images/rockDoodad.png`,
    slashIcon: `http://${ServerTalker.hostName}/images/abilityIcons/slashIcon.png`,
    emptyIcon: `http://${ServerTalker.hostName}/images/abilityIcons/emptyIcon.png`,
    whirlwindIcon: `http://${ServerTalker.hostName}/images/abilityIcons/whirlwindIcon.png`,
    lvl10: `http://${ServerTalker.hostName}/images/abilityIcons/lvl10.png`,
    lvl6: `http://${ServerTalker.hostName}/images/abilityIcons/lvl6.png`,
    stabIcon: `http://${ServerTalker.hostName}/images/abilityIcons/stabIcon.png`,
    lungeIcon: `http://${ServerTalker.hostName}/images/abilityIcons/lungeIcon.png`,
    swingIcon: `http://${ServerTalker.hostName}/images/abilityIcons/swingIcon.png`,
    poundIcon: `http://${ServerTalker.hostName}/images/abilityIcons/poundIcon.png`,
    berserkerSword2: `http://${ServerTalker.hostName}/images/weaponImages/berserkerSword2.png`,
};
class AssetManager {
    public images: Record<ImageName, HTMLImageElement>;
    // public sounds: Record<string, HTMLImageElement>;

    constructor() {
        this.images = {} as Record<ImageName, HTMLImageElement>;
    }

    public async loadAllNecessaryImages() {
        await Promise.all(Object.keys(imageInformation).map((imageName) => this.addImage(imageName as ImageName, imageInformation[imageName as ImageName])));
    }

    public async addImage(name: ImageName, source: string) {
        return new Promise<void>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", source, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    let asset = new Image();
                    asset.onload = () => {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    this.images[name] = asset;
                    resolve();
                } else {
                    reject(`Asset ${name} rejected with error code ${xhr.status}`);
                }
            };
            xhr.onerror = (error) => {
                reject(error);
            };
            xhr.send();
        });
    }
}

export const assetManager = new AssetManager();
