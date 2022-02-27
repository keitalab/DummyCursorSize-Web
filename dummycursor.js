class Vector {
    x = 0;
    y = 0;

    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
}


class Cursor {
    constructor(_x, _y) {
        this.location = new Vector(_x, _y);
    }

    update(moveX, moveY) {
        this.moveDist = Math.sqrt(moveX * moveX + moveY * moveY);
        this.realMoveRad = Math.atan2(moveY, moveX);
        this.rad = this.realMoveRad + this.moveRad;
        this.direction = new Vector(this.moveDist * Math.cos(this.rad), this.moveDist * Math.sin(this.rad));
        this.location.add(this.direction);
    }

    display(_ctx) {
        if (this.showCursor) {
            _ctx.fillStyle = "#f00";
        } else {
            _ctx.fillStyle = "#000";
        }
        _ctx.beginPath();
        _ctx.arc(this.location.x, this.location.y, this.size / 2, 0, 2 * Math.PI, true);
        _ctx.fill();
    }

    checkEdges() {
        if (this.location.x > this.xMax) {
            this.location.x = this.xMin;
        } else if (this.location.x < this.xMin) {
            this.location.x = this.xMax;
        }
        if (this.location.y > this.yMax) {
            this.location.y = this.yMin;
        } else if (this.location.y < this.yMin) {
            this.location.y = this.yMax;
        }
    }
}