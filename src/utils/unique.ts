const Base64 = {
  // 转码表
  table: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '+',
    '/',
  ],
  UTF16ToUTF8: function(str: string) {
    const res = [],
      len = str.length;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      if (code > 0x0000 && code <= 0x007f) {
        // 单字节，这里并不考虑0x0000，因为它是空字节
        // U+00000000 – U+0000007F  0xxxxxxx
        res.push(str.charAt(i));
      } else if (code >= 0x0080 && code <= 0x07ff) {
        // 双字节
        // U+00000080 – U+000007FF  110xxxxx 10xxxxxx
        // 110xxxxx
        const byte1 = 0xc0 | ((code >> 6) & 0x1f);
        // 10xxxxxx
        const byte2 = 0x80 | (code & 0x3f);
        res.push(String.fromCharCode(byte1), String.fromCharCode(byte2));
      } else if (code >= 0x0800 && code <= 0xffff) {
        // 三字节
        // U+00000800 – U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
        // 1110xxxx
        const byte1 = 0xe0 | ((code >> 12) & 0x0f);
        // 10xxxxxx
        const byte2 = 0x80 | ((code >> 6) & 0x3f);
        // 10xxxxxx
        const byte3 = 0x80 | (code & 0x3f);
        res.push(String.fromCharCode(byte1), String.fromCharCode(byte2), String.fromCharCode(byte3));
      } else if (code >= 0x00010000 && code <= 0x001fffff) {
        // 四字节
        // U+00010000 – U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (code >= 0x00200000 && code <= 0x03ffffff) {
        // 五字节
        // U+00200000 – U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ else {
        // 六字节
        // U+04000000 – U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return res.join('');
  },
  UTF8ToUTF16: function(str: string) {
    const res = [],
      len = str.length;
    const i = 0;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      // 对第一个字节进行判断
      if (((code >> 7) & 0xff) == 0x0) {
        // 单字节
        // 0xxxxxxx
        res.push(str.charAt(i));
      } else if (((code >> 5) & 0xff) == 0x6) {
        // 双字节
        // 110xxxxx 10xxxxxx
        const code2 = str.charCodeAt(++i);
        const byte1 = (code & 0x1f) << 6;
        const byte2 = code2 & 0x3f;
        const utf16 = byte1 | byte2;
        res.push(String.fromCharCode(utf16));
      } else if (((code >> 4) & 0xff) == 0xe) {
        // 三字节
        // 1110xxxx 10xxxxxx 10xxxxxx
        const code2 = str.charCodeAt(++i);
        const code3 = str.charCodeAt(++i);
        const byte1 = (code << 4) | ((code2 >> 2) & 0x0f);
        const byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3f);
        const utf16 = ((byte1 & 0x00ff) << 8) | byte2;
        res.push(String.fromCharCode(utf16));
      } else if (((code >> 3) & 0xff) == 0x1e) {
        // 四字节
        // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (((code >> 2) & 0xff) == 0x3e) {
        // 五字节
        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } /** if (((code >> 1) & 0xFF) == 0x7E)*/ else {
        // 六字节
        // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return res.join('');
  },
  encode: function(str: string) {
    if (!str) {
      return '';
    }
    const utf8 = this.UTF16ToUTF8(str); // 转成UTF8
    let i = 0; // 遍历索引
    const len = utf8.length;
    const res = [];
    while (i < len) {
      const c1 = utf8.charCodeAt(i++) & 0xff;
      res.push(this.table[c1 >> 2]);
      // 需要补2个=
      if (i == len) {
        res.push(this.table[(c1 & 0x3) << 4]);
        res.push('==');
        break;
      }
      const c2 = utf8.charCodeAt(i++);
      // 需要补1个=
      if (i == len) {
        res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
        res.push(this.table[(c2 & 0x0f) << 2]);
        res.push('=');
        break;
      }
      const c3 = utf8.charCodeAt(i++);
      res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
      res.push(this.table[((c2 & 0x0f) << 2) | ((c3 & 0xc0) >> 6)]);
      res.push(this.table[c3 & 0x3f]);
    }

    return res.join('');
  },
  decode: function(str: string) {
    if (!str) {
      return '';
    }

    const len = str.length;
    let i = 0;
    const res = [];

    while (i < len) {
      const code1 = this.table.indexOf(str.charAt(i++));
      const code2 = this.table.indexOf(str.charAt(i++));
      const code3 = this.table.indexOf(str.charAt(i++));
      const code4 = this.table.indexOf(str.charAt(i++));

      const c1 = (code1 << 2) | (code2 >> 4);
      const c2 = ((code2 & 0xf) << 4) | (code3 >> 2);
      const c3 = ((code3 & 0x3) << 6) | code4;

      res.push(String.fromCharCode(c1));

      if (code3 != 64) {
        res.push(String.fromCharCode(c2));
      }
      if (code4 != 64) {
        res.push(String.fromCharCode(c3));
      }
    }

    return this.UTF8ToUTF16(res.join(''));
  },
};

/**
 * 随机字符串
 */
export default function generateUnique(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return Base64.encode(uuid);
}
