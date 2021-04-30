import { DoodadType } from "../../object/terrain/doodads/doodad";
import { ServerTalker } from "../servertalker";

export type abilityImageName =
    | "chainsIcon"
    | "fireballIcon"
    | "meteorStrikeIcon"
    | "hammerIcon"
    | "iceIcon"
    | "shieldslamIcon"
    | "shurikenIcon"
    | "staffIcon"
    | "stealthIcon"
    | "poisonedSwordIcon"
    | "axeIcon"
    | "bowIcon"
    | "fistIcon"
    | "blizzardIcon"
    | "healingAuraIcon"
    | "chargeIcon";

export type ImageName = DoodadType;

//let img: HTMLImageElement = assetManager.images["lavafly"];

const imageInformation: Record<ImageName, string> = {
    rockLarge: `http://${ServerTalker.hostName}/images/rockDoodad.png`,
    /*sword: `http://${ServerTalker.hostName}/images/sword.png`,*/
};

class AssetManager {
    public images: Record<ImageName, HTMLImageElement>;
    // public sounds: Record<string, HTMLImageElement>;

    constructor() {
        this.images = {} as Record<ImageName, HTMLImageElement>;
        Object.keys(imageInformation).forEach((imageName) => {
            this.addImage(imageName as ImageName, imageInformation[imageName as ImageName]);
        });
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
