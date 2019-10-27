class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Rectangle
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point)
    {
        //return (this.x-this.w < point.x && point.x < this.x+this.w &&
        //    this.y-this.h < point.y && point.y < this.y+this.h);
        return (this.x-this.w <= point.x && point.x <= this.x+this.w &&
            this.y-this.h <= point.y && point.y <= this.y+this.h);
    }

    intersects(range)
    {
        return !(range.x > this.x + this.w ||
        range.x + range.w < this.x ||
        range.y > this.y + this.h ||
        range.y + range.h < this.y);
    }
        
}

class Circle
{
    constructor(x, y, r)
    {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    contains(point)
    {
        let dx = point.x - this.x;
        let dy = point.y - this.y;
        return (dx*dx + dy*dy) <= this.r*this.r;
    }

    intersects(range)
    {

    }
}

class QuadTree
{
    constructor(boundary, capacity)
    {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
    }

    insert(point)
    {
        let success = false;
        //insert only if point is within boundary
        if(this.boundary.contains(point))
        {
            if(this.points.length < this.capacity)
            {
                this.points.push(point);
                success = true;
            }
            else
            {
                if(this.northwest == null)
                    this.subdivide();

                if(this.northwest.insert(point) ||
                this.northeast.insert(point) ||
                this.southwest.insert(point) || 
                this.southeast.insert(point))
                {
                    success = true;
                }
            }
        }
        return success;
    }

    subdivide()
    {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let nw = new Rectangle(x-w/2, y-h/2, w/2, h/2);
        let ne = new Rectangle(x+w/2, y-h/2, w/2, h/2);
        let sw = new Rectangle(x-w/2, y+h/2, w/2, h/2);
        let se = new Rectangle(x+w/2, y+h/2, w/2, h/2);

        this.northwest = new QuadTree(nw, this.capacity);
        this.northeast = new QuadTree(ne, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);
    }

    show()
    {
        strokeWeight(1);
        noFill();
        //stroke(255);
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
        if(this.northwest != null)
        {
            this.northwest.show();
            this.northeast.show();
            this.southwest.show();
            this.southeast.show();
        }

        for(let p of this.points)
        {
            strokeWeight(4);
            point(p.x, p.y)
        }
    }
}

let canvasWidth = 480;
let canvasHeight = 300;
let boundary = new Rectangle(canvasWidth/2, canvasHeight/2, canvasWidth/2, canvasHeight/2);
let qt = new QuadTree(boundary, 4);
console.log(qt);

function setup()
{
    // put setup code here
    //createCanvas(640, 480);
    createCanvas(canvasWidth, canvasHeight);
    //createCanvas(300, 300);
    /*for(let i = 0; i < 500; i++)
    {
        qt.insert(new Point(random(width), random(height)));
    }*/
}
/*
function mouseClicked()
{

    let m = new Point(mouseX, mouseY);
    qt.insert(m);
}*/

function draw()
{
    if(mouseIsPressed)
    {
        let m = new Point(mouseX, mouseY);
        qt.insert(m);
    }

    //background(0);
    background(135, 206, 235);
    qt.show();
}