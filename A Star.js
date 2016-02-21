var expanded = [];
var dontExpand = [];
var notExpand = [];
var toExpand = [];
var path = [];

function processData(input) {
    //Enter your code here
    var p = findPacman(input);
    var start = p;
    var finish = findFood(input);
    var m = getMap(input);

    while(p != finish){
        p = movePacman(p, finish, m);
    }

    path.push(finish);
    findPath(start);

    path.removeItemFromArray(start, true, true);
    path = [start].concat(path);

    removeDuplicate();

    findPath(start);

    console.log(path.length - 1);
    for (var i = 0; i < path.length; i++) {
        console.log(path[i]);
    };
  }

function removeDuplicate(){
    var temp = [];
    for (var i = 0; i < path.length; i++) {
        var t = path[i];
        if(!temp.contain(t)){
            temp.push(t);
        }
    };
    path = temp;
}

function findPath(start){
    var temp = [].concat(path);

    var l = temp.length;
    var i = 1;
    var s = temp[l - i];
    var e = temp[l - i - 1];
    while(e != start){
        i++;
        var distance = getDistance(s, e);
        if(distance != 1){
            path.removeItemFromArray(e, false, true);
        }else{
            s = e;
        }
        e = temp[l - i - 1];
    }
}

function findPacman(input){
    return input.split("\n")[0];
}

function findFood(input){
    return input.split("\n")[1];
}

function getMap(input){
    var lines = input.split("\n");
    var map = [];
    for(var i = 3; i < lines.length; i++){
        map[i-3] = lines[i];
    }
    return map;
}

function movePacman(pac, food, map){
    toExpand = getAvaliableMoves(pac, food, map);
    dontExpand.push(pac);

    var t = [];
    for(var i = 0; i < toExpand.length; i++){
        var s = toExpand[i];
        if(!dontExpand.contain(s)){
           t.push(s);
        }
    }

    toExpand = t;

    var move = getLowestCostMove(toExpand);

    if(!move){
        move = getLowestCostMove(notExpand);
        notExpand.removeItemFromArray(move);
        for (var i = 0; i < expanded.length; i++) {
            var child = expanded[i];
            for(var j = 0; j < child.length; j++){
                var node = child[j];
                if(move == node){
                    var t = path[i];
                    path.push(t);
                }
            }
        };
    }else{
        toExpand.removeItemFromArray(move);
        path.push(pac);
        notExpand = notExpand.concat(toExpand);
        expanded.push(toExpand);
    }

    return move;
}

function getLowestCostMove(nodes){
    var move;
    if(nodes.length !== 0){
        move = nodes[0];
        var hc = getDistance(move);
        for(var i = 0; i < nodes.length; i++){
            var temp = getDistance(nodes[i]);
            if(temp < hc){
                move = nodes[i];
            }
        }
    }
    return move;
}

Array.prototype.removeItemFromArray = function(obj, toEnd, reverse){
    if(reverse){
        this.reverse();
    }
    if(toEnd){
        this.splice(this.indexOf(obj));
    }else{
        this.splice(this.indexOf(obj), 1);
    }
    if(reverse){
        this.reverse();
    }
    return this;
};
Array.prototype.contain = function(obj){
    for(var i = 0; i < this.length; i++){
        if(this[i] == obj){
            return true;
        }
    }
    return false;
};

function getChar(map, Y, X){
    return (map[Y]).toString().charAt(X);
}

function getAvaliableMoves(pac, food, map){
    var pacX = Number.parseInt(pac.split(" ")[0]);
    var pacY = Number.parseInt(pac.split(" ")[1]);
    var left = getChar(map, pacX, (pacY-1));
    var right = getChar(map, pacX, (pacY+1));
    var up = getChar(map, (pacX-1), pacY);
    var down = getChar(map, (pacX+1), pacY);
    var result = [];

    if(up == "-" || up == "."){
        result.push((pacX-1) + " " + pacY);
    }
    if(down == "-" || down == "."){
        result.push((pacX+1) + " " + pacY);
    }
    if(left == "-" || left == "."){
        result.push(pacX + " " + (pacY-1));
    }
    if(right == "-" || right == "."){
        result.push(pacX + " " + (pacY+1));
    }

    if(result.contain(food)){
        result = [];
        result.push(food);
    }

    return result;
}

function getDistance(point, target){
    var pointY = Number.parseInt(point.split(" ")[0]);
    var pointX = Number.parseInt(point.split(" ")[1]);
    var foodY = 35;
    var foodX = 1;
    if(target){
        foodY = Number.parseInt(target.split(" ")[0]);
        foodX = Number.parseInt(target.split(" ")[1]);
    }
    return Math.abs(pointY - foodY) + Math.abs(pointX - foodX);
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input);
});

