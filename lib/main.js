/* ---------- header ---------- */
"use strict";
/* ---------- header ---------- */

/*

駒と数値の対応表

| 駒種 | 先手 | 後手 |
|------|------|------|
| 空白 | 0	  | 0	   |
| 歩   | 1	  | -1	 |
| 香   | 2	  | -2	 |
| 桂   | 3	  | -3	 |
| 銀   | 4	  | -4	 |
| 金   | 5	  | -5	 |
| 角   | 6	  | -6	 |
| 飛   | 7	  | -7	 |
| 玉   | 8	  | -8	 |
| と   | 9	  | -9	 |
| 成香 | 10	  | -10	 |
| 成桂 | 11	  | -11	 |
| 成銀 | 12	  | -12	 |
| 馬   | 13	  | -13	 |
| 龍   | 14	  | -14	 |

*/

var Shogi64 = {};

Shogi64.table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

// 歩(1)と玉(8)が入っていない
var pieceHuffmanMap = {
  '0'   :	'0',
  '2'   :	'1001',
  '-2'  :	'1000',
  '5'   :	'1011',
  '-5'  :	'1010',
  '3'   :	'11001',
  '-3'  :	'11000',
  '4'   :	'11011',
  '-4'  :	'11010',
  '7'   :	'11101',
  '-7'  :	'11100',
  '6'   :	'111101',
  '-6'  :	'111100',
  '13'  :	'11111001',
  '-13' :	'11111000',
  '14'  :	'11111011',
  '-14' :	'11111010',
  '9'   :	'11111101',
  '-9'  :	'11111100',
  '11'  :	'111111101',
  '-11' :	'111111100',
  '12'  :	'1111111101',
  '-12' :	'1111111100',
  '10'  :	'1111111111',
  '-10' :	'1111111110'
};

// 玉と歩も入れている。盤面があれなときに利用
var allPieceHuffmanMap = {
  '0'   : '0',
  '1'   : '101',
  '-1'  : '100',
  '2'   : '11001',
  '-2'  : '11000',
  '5'   : '11011',
  '-5'  : '11010',
  '3'   : '111001',
  '-3'  : '111000',
  '4'   : '111101',
  '-4'  : '111100',
  '8'   : '1110101',
  '-8'  : '1110100',
  '7'   : '1110111',
  '-7'  : '1110110',
  '6'   : '1111101',
  '-6'  : '1111100',
  '13'  : '111111001',
  '-13' : '111111000',
  '14'  : '111111011',
  '-14' : '111111010',
  '9'   : '111111101',
  '-9'  : '111111100',
  '11'  : '1111111101',
  '-11' : '1111111100',
  '12'  : '11111111101',
  '-12' : '11111111100',
  '10'  : '11111111111',
  '-10' : '11111111110'
};

// プロパティ名は筋の数値で、0は無しを意味する
var pawnHuffmanMap = {
  '7':	'0',
  '6':	'10',
  '0':	'110',
  '5':	'1110',
  '4':	'11110',
  '8':	'111110',
  '3':	'1111110',
  '9':	'11111110',
  '2':	'11111111'
};

var handsHuffmanMap = {
  // 歩
  'FU' : [
    '00',
    '01',
    '10',
    '110',
    '1110',
    '11110',
    '111110',
    '1111110',
    '11111110',
    '111111110',
    '1111111110',
    '11111111110',
    '111111111110',
    '1111111111110',
    '11111111111110',
    '111111111111110',
    '1111111111111110',
    '11111111111111110',
    '11111111111111111'],
  'KY' : ['0', '10', '110', '1110', '1111'],
  'KE' : ['0', '10', '110', '1110', '1111'],
  'GI' : ['0', '10', '110', '1110', '1111'],
  'KI' : ['0', '10', '110', '1110', '1111'],
  'KA' : ['0', '10', '11'],
  'HI' : ['0', '10', '11']
};

var handsPieceMap = {
  'FU' : 0,
  'KY' : 1,
  'KE' : 2,
  'GI' : 3,
  'KI' : 4,
  'KA' : 5,
  'HI' : 6
};

function _isArray(arg) {
  return Object.prototype.toString.call(arg) === "[object Array]";
}

function _validatePosition(position) {
  // 手番の検査
  if(typeof(position.turn) !== 'boolean') {
    return false;
  }

  // 盤駒の検査
  if(_isArray(position.board) === true) {

    // 駒は全て数値かどうか
    for(var i = 0, l = position.board.length; i < l; i++) {
      if(-14 > position.board[i] && 14 < position.board[i]) {
        return false;
      }
    }

    // 駒が空白も含めて全てあるか
    if(i !== 81) {
      return false;
    }

  } else {
    return false;
  }

  // 持ち駒の検査
  if(position.hands.black !== undefined &&
     position.hands.white !== undefined) {

    for(var piece in handsPieceMap) {

      // 駒のプロパティをもち、かつ数値か
      if(typeof(position.hands.black[piece]) === 'number' &&
         typeof(position.hands.white[piece]) === 'number') {

        // 持ち駒の数値は定義されている値か
        if(handsHuffmanMap[piece][position.hands.black[piece]] === undefined) {
          return false;
        }

      } else {
        return false;
      }
    }

  } else {
    return false;
  }

  return true;
}

function _validateShogi64(shogi64) {
  return /^[A-Za-z0-9\-\_]+$/.test(shogi64);
}

function _validateBits(bits) {
  return bits.length >= 6 && /^[01]+$/.test(bits);
}

// encode

function _encodeTurnToBits(turn) {
  // 先手1、 後手0
  return Number(turn);
}

function _encodeModeToBits(board) {
  var blackKing = 0,
      whiteKing = 0,
      blackPawn = 0,
      whitePawn = 0;

  for(var i = 9; i >= 1; i--) {
    blackPawn = 0;
    whitePawn = 0;

    for(var ji = 1; ji <= 9; ji++) {

      // 先手と後手でそれぞれ1段と9段に歩があればMixed Mode
      if((ji === 1 && board[ji * 9 - i] === 1) ||
         (ji === 9 && board[ji * 9 - i] === -1)) {
        return 1;
      }

      switch(board[ji * 9 - i]) {
      case 8: blackKing += 1; break;
      case -8: whiteKing += 1; break;
      case 1: blackPawn += 1; break;
      case -1: whitePawn += 1; break;
      default: break;
      }

      // 歩が複数あればMixed mode
      if(blackPawn > 1 || whitePawn > 1) {
        return '1';
      }
    }
  }

  // 玉が複数あればMixed mode
  if(blackKing > 1 || whiteKing > 1) {
    return '1';
  }

  // 問題なければNormal
  return '0';
}

function _encodeBoardToBits(board, mode) {
  var ret = '',
      map = (mode === '0') ? pieceHuffmanMap : allPieceHuffmanMap;

  if(mode === '0') {
    // 玉
    ret += (function() {
      var blackKing = '0000000',
          whiteKing = '0000000';

      for(var bits = '', i = 0, l = board.length; i < l; i++) {
        bits = ('00000000' + (i + 1).toString(2)).slice(-7);

        if(board[i] === 8) {
          blackKing = bits;
        } else if(board[i] === -8) {
          whiteKing = bits;
        } else {}
      }

      return blackKing + whiteKing;
    })();

    // 歩
    ret += (function() {
      var blackPawn = [],
          whitePawn = [];

      for(var bh, wh, i = 9; i >= 1; i--) {
        bh = '';
        wh = '';

        for(var ji = 1; ji <= 9; ji++) {
          if(board[ji * 9 - i] === 1) {
            bh = pawnHuffmanMap[ji];
          } else if(board[ji * 9 - i] === -1) {
            wh = pawnHuffmanMap[10 - ji];
          } else{}

        }

        blackPawn.push((bh === '') ? pawnHuffmanMap[0] : bh);
        whitePawn.push((wh === '') ? pawnHuffmanMap[0] : wh);
      }

      return blackPawn.join('') + whitePawn.join('');
    })();
  }

  // その他の駒
  for(var i = 0, l = board.length; i < l; i++) {
    if(map[board[i]] !== undefined) {
      ret += map[board[i]];
    }
  }

  return ret;
}

function _encodeHandsToBits(hands) {
  var ret = {};

  for(var turn in hands) {
    ret[turn] = ['0', '0', '0', '0', '0', '0', '0'];

    for(var piece in hands[turn]) {
      // 対応する持ち駒のインデックスに符号を代入
      ret[turn][handsPieceMap[piece]] = handsHuffmanMap[piece][hands[turn][piece]];
    }
  }

  return ret.black.join('') + ret.white.join('');
}

Shogi64.encodePositionToBits = function(position) {
  if(_validatePosition(position) === false) {
    throw new Error('board is invalid.');
  }

  var mode = _encodeModeToBits(position.board);

  return  _encodeTurnToBits(position.turn) +  mode + _encodeBoardToBits(position.board, mode) + _encodeHandsToBits(position.hands);
};

Shogi64.encodeBitsToShogi64 = function(bits) {
  if(_validateBits(bits) === false) {
    throw new Error('bits string is invalid.');
  }

  var ret = '';
  var table = (function(chars) {
    var ret = {};

    for(var i = 0, l = chars.length; i < l; i++) {
      ret[('00000000' + i.toString(2)).slice(-6)] = chars.charAt(i);
    }

    return ret;
  })(this.table);

  // 6bitで割り切れる数に調整
  if(bits.length % 6 !== 0) {
    bits = (bits + '000000').slice(0, -(bits.length % 6));
  }

  for(var i = 0, l = bits.length / 6; 0 < l; i+=6, l--) {
    ret += table[bits.substr(i, 6)];
  }

  return ret;
};

Shogi64.encode = function(position) {
  if(_validatePosition(position) === false) {
    throw new Error('board is invalid.');
  }

  return this.encodeBitsToShogi64(this.encodePositionToBits(position));
};

// decode

Shogi64.decodeShogi64ToBits = function(shogi64) {
  if(_validateShogi64(shogi64) === false) {
    throw new Error('shogi64 string is invalid.');
  }

  var ret = '';
  var table = (function(chars) {
    var ret = {};

    for(var i = 0, l = chars.length; i < l; i++) {
      ret[chars.charAt(i)] = ('00000000' + i.toString(2)).slice(-6);
    }

    return ret;
  })(this.table);

  for(var i = 0, l = shogi64.length; i < l; i++) {
    ret += table[shogi64[i]];
  }

  return ret;
};

function BitsProvider(bits) {
  this.bits = bits;
  this.len = bits.length;
  this.index = 0;
}

BitsProvider.prototype.letter = function() {
  var ret = this.bits[this.index];
  this.index += 1;
  return ret;
};

BitsProvider.prototype.range = function(len) {
  var ret = this.bits.substr(this.index, len);
  this.index += len;
  return ret;
};


BitsProvider.prototype.checkOverFlow = function() {
  return this.len < this.index;
};

var huffmanToPawnMap = (function(map) {
  var ret = {};

  for(var key in map) {
    ret[map[key]] = key;
  }

  return ret;
})(pawnHuffmanMap);

var huffmanToHandsMap = (function(map) {
  var ret = {};

  for(var key in map) {
    ret[key] = {};
    for(var i = 0, l = map[key].length; i < l; i++) {
      ret[key][map[key][i]] = i;
    }
  }

  return ret;
})(handsHuffmanMap);

//手番:1 モード:1 駒の配置:81 持ち駒:14 = 合計97回
Shogi64.decodeBitsToPosition = function(bits) {
  var ret = {turn: null, board: [], hands: {}},
      count = 97,
      turn = ['black', 'white'],
      provider = new BitsProvider(bits),
      buf = '',
      mode = null,
      map = {};

  var i, l;

  // 配列初期化
  for(i = 0; i < 81; i++) { ret.board[i] = 0; }

  // 手番
  ret.turn = Boolean(parseInt(provider.letter(), 10));
  count -= 1;

  // モード
  mode = Boolean(parseInt(provider.letter(), 10));
  count -= 1;

  if(mode === false) {
    // 玉
    var kingIndex;
    for(i = 0, l = turn.length; i < l; i++) {
      buf = provider.range(7);

      if(provider.checkOverFlow() === true) {
        throw new Error('shogi64 string is invalid.');
      }

      kingIndex = parseInt(buf, 2) - 1;
      if(kingIndex > 0) {
        ret.board[kingIndex] = (turn[i] === 'black') ? 8 : -8;
        count -= 1;
      }
    }

    // 歩
    var pawnY;
    for(i = 0, l = turn.length; i < l; i++) {

      // 9筋からデコードしてあてはめていく
      for(var ji = 9; ji >= 1; ji--) {
        buf = '';

        while(huffmanToPawnMap[buf] === undefined) {
          buf += provider.letter();
          if(provider.checkOverFlow() === true) {
            throw new Error('shogi64 string is invalid.');
          }
        }

        pawnY = huffmanToPawnMap[buf];

        if(pawnY !== '0') {
          if(turn[i] === 'black') {
            ret.board[pawnY * 9 - ji] = 1;
          } else if(turn[i] === 'white') {
            ret.board[(10 - pawnY) * 9 - ji] = -1;
          } else{}

          count -= 1;
        }
      }
    }
  }

  map = (function(map) {
    var ret = {};

    for(var key in map) {
      ret[map[key]] = key;
    }

    return ret;
  })((mode === true) ? allPieceHuffmanMap : pieceHuffmanMap);

  // 盤駒
  for(i = 0, l = ret.board.length; i < l; i++) {
    if(ret.board[i] !== 0) {
      continue;
    }

    buf = '';
    while(map[buf] === undefined) {
      buf += provider.letter();
      if(provider.checkOverFlow() === true) {
        throw new Error('shogi64 string is invalid.');
      }
    }

    ret.board[i] = parseInt(map[buf], 10);
    count -= 1;
  }

  // 持ち駒
  // black whiteの順で復号するように
  for(i = 0, l = turn.length; i < l; i++) {
    ret['hands'][turn[i]] = {};

    for(var key in huffmanToHandsMap) {
      buf = '';
      while(huffmanToHandsMap[key][buf] === undefined) {
        buf += provider.letter();

        if(provider.checkOverFlow() === true) {
          throw new Error('shogi64 string is invalid.');
        }
      }

      ret['hands'][turn[i]][key] = huffmanToHandsMap[key][buf];
      count -= 1;
    }
  }

  // 回数分なければエラー
  if(count !== 0) {
    throw new Error('shogi64 string is invalid.');
  }

  return ret;
};

Shogi64.decode = function(shogi64) {
  if(_validateShogi64(shogi64) === false) {
    throw new Error('shogi64 string is invalid.');
  }

  return this.decodeBitsToPosition(this.decodeShogi64ToBits(shogi64));
};

/* ---------- exports ---------- */
module.exports = Shogi64;
/* ---------- exports ---------- */
