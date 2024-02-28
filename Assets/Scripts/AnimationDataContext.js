export default class AnimationDataContext {
    image = undefined;
    image_source_normal = undefined;
    image_source_flipped = undefined;
    frame_data = undefined;

    constructor(image_source_path, frame_data) {
        this.image = new Image();
        this.image_source_normal = image_source_path + ".png";
        this.image_source_flipped = image_source_path + "_flipped.png";
        this.frame_data = frame_data;
    }
}