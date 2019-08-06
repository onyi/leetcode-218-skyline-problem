class MaxHeap{
  constructor(val){
    this.array = [null];
  }

  getParent(idx){
    if(idx <= 0 ) return null;
    return Math.floor(idx / 2);
  }

  getLeftChild(idx){
    return idx / 2;
  }

  getRightChild(idx){
    return idx / 2 + 1;
  }

  siftUp(idx){
    let parent = this.getParent(idx);
    while( this.array[parent] < this.array[idx] && parent > 0 ){
      [this.array[parent], this.array[idx]] = [this.array[idx], this.array[parent]]
      idx = parent;
      parent = this.getParent(parent);
    }
  }

  siftDown(idx){

    if(this.getLeftChild > this.array.length) return;

    let leftIdx = this.getLeftChild(idx);
    let rightIdx = this.getRightChild(idx);
    let leftVal = this.array[leftIdx];
    let rightVal = this.array[rightIdx];
    let current  = this.array[idx];
    let swap = rightVal === undefined || leftVal > rightVal ? leftIdx : rightIdx;

    while( swap < this.array.length && this.array[idx] < this.array[swap] ){
      [this.array[idx], this.array[swap]] = [this.array[swap], this.array[idx] ];
      idx = swap;
      leftIdx = this.getLeftChild(idx);
      rightIdx = this.getRightChild(idx);
      leftVal = this.array[leftIdx];
      rightVal = this.array[rightIdx];
      swap = rightVal === undefined || leftVal > rightVal ? leftIdx : rightIdx;
    }
  }

  insert(val){
    this.array.push(val);
    this.siftUp(this.array.length - 1);

  }

  deleteMax(){
    if(this.array.length === 1 ) return null;
    let max = this.array[1];
    let last = this.array.pop();
    if(this.array.length !== 1) this.array[1] = last;
    this.siftDown(1);
    return max;
  }

  getMax(){
    if(this.array.length === 1) return 0;
    return this.array[1];
  }

  delete(val){
    let idx = this.array.indexOf(val);
    if( idx < 0) return;
    [this.array[idx], this.array[1]] = [this.array[1], this.array[idx]];
    this.deleteMax();
  }

}



var getSkyline = function (buildings) {

  let maxHeap = new MaxHeap();

  const START = 1;
  const END = 2;
  let skylines = [];
  buildings.forEach( b => { //COnvert building properties to bunch of hashes for sorting later.
    [l, r, h] = b;
    console.log(`Building: ${b}, Left: ${l}, Right: ${r}; Height: ${h}`);
    let start = { x: l, y: h, type: START};
    let end = { x: r, type: END, start };
    skylines.push(start, end);
  });

  console.log(`Skylines Array before sorting: ${skylines.map( el => JSON.stringify(el)) }`)


  skylines.sort( (a,b) => {
    if( a.x != b.x ) return a.x - b.x;
    else if ( a.type !== b.type) return a.type - b.type;
    else if( a.type === START ) return a.y - b.y;
    else return a.start.y - b.start.y;
  })

  console.log(`Skylines Array after sorting: ${skylines.map(el => JSON.stringify(el)) }`)

  let points = [];
  skylines.forEach( skyline => {
    console.log(`Skyline data: ${JSON.stringify(skyline)}, Max: ${maxHeap.getMax()}`)

    if( skyline.type === START ){
      if(skyline.y > maxHeap.getMax() ){
        points = points.filter(point => point[0] !== skyline.x ) //Remove all points that are starting at the same X position as the current skyline building
        points.push([skyline.x, skyline.y]);
      }
      maxHeap.insert(skyline.y);
    }
    else{
      maxHeap.delete(skyline.start.y);
      if(skyline.start.y > maxHeap.getMax()){
        points.push([skyline.x, maxHeap.getMax()]);
      }
    }

  }) 

  return points;


}


let buildings = [[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]];

let res = getSkyline(buildings);
console.log(`Result after: ${res}`)