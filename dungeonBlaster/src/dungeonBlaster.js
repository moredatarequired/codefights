class GameState {
    constructor(frozenDescription) {
        let parts = frozenDescription.split(';');
        this.width = parts[0];
        this.height = parts[1];
        this.state = parts[2].split(':');
    }

    static toFrozen(description) {
        return description[0].length + ';' +
            description.length + ';' +
            description.join(':');
    }

    freeze() {
        return GameState.toFrozen(this.state);
    }

    playerPosition() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.state[i][j] === '*') {
                    return [i, j];
                }
            }
        }
    }

    move(position, offset, radix) {
        return (position + offset + radix) % radix;
    }

    potentialMoves(position) {
        return [
            [this.move(position[0], -1, this.height), position[1]],
            [this.move(position[0], 1, this.height), position[1]],
            [position[0], this.move(position[1], -1, this.height)],
            [position[0], this.move(position[1], 1, this.height)]
        ];
    }

    isWall(position) {
        return this.state[position[0]][position[1]] === '#';
    }

    isDoor(position) {
        let char = this.state[position[0]][position[1]].charCodeAt(0);
        return char >= 65 && char <= 90;
    }

    keyAt(position) {
        let char = this.state[position[0]][position[1]].charCodeAt(0);
        if (char >= 97 && char <= 122) {
            return String.fromCharCode(char - 32);
        }
        return null;
    }

    unlock(key) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.state[i][j] === key) {
                    this.state[i] = setCharAt(this.state[i], j, ' ');
                }
            }
        }
    }

    isOpen(position) {
        return !this.isWall() && !this.isDoor();
    }

    setCharAt(str,index,chr) {
        return str.substr(0,index) + chr + str.substr(index+1);
    }

    movePlayer(oldPosition, newPosition) {
        let doorKey = this.keyAt(newPosition);
        if (doorKey) {
            this.unlock(doorKey);
        }
        this.state[oldPosition[0]] = this.setCharAt(this.state[oldPosition[0]], oldPosition[1], ' ');
        this.state[newPosition[0]] = this.setCharAt(this.state[newPosition[0]], newPosition[1], '*');
    }

    legalMoves(p) {
        const testMoves = this.potentialMoves(p);
        let moves = [];
        for (let i = 0; i < testMoves.length; i++) {
            if (!this.isWall(testMoves[i])) {
                moves.push(testMoves[i]);
            }
        }
        return moves;
    }

    wins(position) {
        return this.state[position[0]][position[1]] === '^';
    }
}

function dungeonBlaster(m) {
    let seenPositions = new Set();
    let toEvaluate = [GameState.toFrozen(m)];
    while (toEvaluate.length > 0) {
        let m = toEvaluate.shift();
        if (seenPositions.has(m)) {
            continue;
        }
        seenPositions.add(m);
        let gs = new GameState(m);
        seenPositions.add()
        const p = gs.playerPosition();
        let moves = gs.legalMoves(p);
        for (let i = 0; i < moves.length; i++) {
            if (gs.wins(moves[i])) {
                return true;
            }
            let nextGs = new GameState(m);
            nextGs.movePlayer(p, moves[i]);
            toEvaluate.push(nextGs.freeze());
        }
    }
    return false;
}

module.exports = GameState;
