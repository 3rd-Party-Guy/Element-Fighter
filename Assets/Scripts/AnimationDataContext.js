export default class AnimationDataContext {
    image = undefined;
    image_source_normal = undefined;
    image_source_flipped = undefined;
    frame_data = undefined;

    constructor(spritesheets_path, frame_data) {
        this.image = new Image();
        this.image_source_normal = spritesheets_path + frame_data["animation_path"]+".png";
        this.image_source_flipped = spritesheets_path + frame_data["animation_path"] + "_flipped.png";
        this.frame_data = frame_data;
    }
}