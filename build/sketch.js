class Point
{
    constructor(x, y, data=null)
    {
        this.x = x;
        this.y = y;
        this.data = data;
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

        this.centerX = this.x + this.w/2;
        this.centerY = this.y + this.h/2;
    }

    contains(point)
    {
        //return (this.x-this.w < point.x && point.x < this.x+this.w &&
        //    this.y-this.h < point.y && point.y < this.y+this.h);
        /*return (this.x-this.w <= point.x && point.x <= this.x+this.w &&
            this.y-this.h <= point.y && point.y <= this.y+this.h);*/
            return (this.x <= point.x && point.x <= this.x+this.w &&
                this.y <= point.y && point.y <= this.y+this.h);
    }

    intersects(range)
    {
        /*return !(range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.y > this.y + this.h ||
        range.y + range.h < this.y - this.h);*/
        return !(range. x > this.x + this.w ||
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

        /*let nw = new Rectangle(x-w/2, y-h/2, w/2, h/2);
        let ne = new Rectangle(x+w/2, y-h/2, w/2, h/2);
        let sw = new Rectangle(x-w/2, y+h/2, w/2, h/2);
        let se = new Rectangle(x+w/2, y+h/2, w/2, h/2);*/

        let nw = new Rectangle(x, y, w/2, h/2);
        let ne = new Rectangle(x+w/2, y, w/2, h/2);
        let sw = new Rectangle(x, y+h/2, w/2, h/2);
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
        //rectMode(CENTER);
        //rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
        rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
        for(let p of this.points)
        {
            strokeWeight(4);
            point(p.x, p.y)
        }

        if(this.northwest != null)
        {
            this.northwest.show();
            this.northeast.show();
            this.southwest.show();
            this.southeast.show();
        }
    }

    query(range)
    {
        let foundPoints = [];
        this._query(range, foundPoints);
        return foundPoints;
    }

    _query(range, foundPoints)
    {
        if(range.intersects(this.boundary))
        {
            for(let p of this.points)
            {
                if(range.contains(p))
                {
                    foundPoints.push(p);
                }
            }
        }

        if(this.northwest != null)
        {
            this.northwest._query(range, foundPoints);
            this.northeast._query(range, foundPoints);
            this.southwest._query(range, foundPoints);
            this.southeast._query(range, foundPoints);
        }
    }

    getAllPoints()
    {
        let allPoints = [];

        this._getAllPoints(allPoints);

        return allPoints;
    }

    _getAllPoints(allPoints)
    {
        [].push.apply(allPoints, this.points.slice());

        if(this.northwest != null)
        {
            this.northwest._getAllPoints(allPoints);
            this.northeast._getAllPoints(allPoints);
            this.southwest._getAllPoints(allPoints);
            this.southeast._getAllPoints(allPoints);
        }
    }

}

let canvasWidth = 480;
let canvasHeight = 300;
//let boundary = new Rectangle(canvasWidth/2, canvasHeight/2, canvasWidth/2, canvasHeight/2);
let boundary = new Rectangle(0, 0, canvasWidth, canvasHeight);
let qt = new QuadTree(boundary, 4);
//console.log(qt);
let rectangle =  new Rectangle(0, 0, canvasWidth/4, canvasHeight/4);

function setup()
{
    // put setup code here
    createCanvas(canvasWidth, canvasHeight);

    /*for(let i = 0; i < 15; i++)
    {
        //qt.insert(new Point(random(width), random(height)));
        let p = new Point(5+i*30, 50);
        console.log(i + " " + p);
        qt.insert(p);
    }*/

    /*for(let i = 0; i < 5; i++)
    {
        //qt.insert(new Point(random(width), random(height)));
        let p = new Point(random(width), random(height));
        //p = new Point(5+i*30, 50);
        console.log(i + " " + p);
        qt.insert(p);
    }*/

    //console.log(qt.query(new Rectangle(width/2, height/2, width/2, height/2)));
    //rectangle = new Rectangle(width/2, height/2/2, width/2/2, height/2/2);
    //console.log(qt.getAllPoints());
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

    rectangle.x = mouseX - rectangle.w / 2;
    rectangle.y = mouseY - rectangle.h / 2;
    push();
    //rectMode(CENTER);
    stroke("RED");
    strokeWeight(2);
    noFill();
    rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    pop();

    let points = qt.query(rectangle);
    //console.log(points);
    for(let p of points)
    {
        push();
        stroke("RED");
        strokeWeight(4);
        point(p.x, p.y);
        pop();
    }

    push();
    //stroke("RED");
    fill(250);
    textSize(20);
    //textAlign(CENTER, CENTER);
    //text("Count " + points.length, mouseX, rectangle.y+rectangle.h+15);
    text("Count " + points.length, 10, 25);
    pop();
}

function mouseWheel(event)
{
    let change = event.delta / Math.abs(event.delta) * 0.25;
    let newWidth = rectangle.w - change * rectangle.w;
    let newHeight = rectangle.h - change * rectangle.h;

    if(newWidth > 0 && newHeight > 0)
    {
        rectangle.w = newWidth;
        rectangle.h = newHeight;
    }
}