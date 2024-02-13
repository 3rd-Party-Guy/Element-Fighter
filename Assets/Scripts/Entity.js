// Author:          Nikolay Hadzhiev
// Description:     Base Entity class

export default class Entity {
    x = 0;
    y = 0;

    frame_width = 60;
    frame_height = 60;
    frame_num = 1;

    frame_index = 0;

    image = undefined;

    last_update = Date.now();

    update_speed = 1;

    constructor(startX, startY, spritesheet_path) {
        this.x = startX;
        this.y = startY;
        
        this.image = new Image();
        this.image.src = spritesheet_path;
    }

    update() {
        if ((Date.now() - this.last_update) < this.update_speed)
            return;

        this.frame_index = (this.frame_index + 1) % this.frame_num;
        this.last_update = Date.now();
    }

    render(ctx) {
        ctx.drawImage(
            this.image,
            this.frame_index * this.frame_width / this.frame_num,
            0,
            this.frame_width / this.frame_num,
            this.frame_height,
            this.x,
            this.y,
            this.frame_width / this.frame_num,
            this.frame_height
        );
    }
};