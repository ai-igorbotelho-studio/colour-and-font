/* ── empacotamento em .zip, sem biblioteca (método store, CRC-32) ── */
export interface ZipEntry { name: string; data: Uint8Array }

const CRCT = (() => { const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })();
export function crc32(u8: Uint8Array): number { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRCT[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0 }

export function makeZip(files: ZipEntry[], now: Date = new Date()): Blob {
  const te = new TextEncoder(), parts: Uint8Array[] = [], cd: Uint8Array[] = []; let off = 0;
  const d = now, dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
        tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  files.forEach(f => {
    const nm = te.encode(f.name), crc = crc32(f.data), sz = f.data.length;
    const lh = new Uint8Array(30 + nm.length), v = new DataView(lh.buffer);
    v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0x0800, true);
    v.setUint16(10, tm, true); v.setUint16(12, dt, true); v.setUint32(14, crc, true);
    v.setUint32(18, sz, true); v.setUint32(22, sz, true); v.setUint16(26, nm.length, true);
    lh.set(nm, 30); parts.push(lh, f.data);
    const ch = new Uint8Array(46 + nm.length), w = new DataView(ch.buffer);
    w.setUint32(0, 0x02014b50, true); w.setUint16(4, 20, true); w.setUint16(6, 20, true);
    w.setUint16(8, 0x0800, true); w.setUint16(12, tm, true); w.setUint16(14, dt, true);
    w.setUint32(16, crc, true); w.setUint32(20, sz, true); w.setUint32(24, sz, true);
    w.setUint16(28, nm.length, true); w.setUint32(42, off, true);
    ch.set(nm, 46); cd.push(ch); off += lh.length + sz;
  });
  const cdSize = cd.reduce((a, x) => a + x.length, 0);
  const eo = new Uint8Array(22), e = new DataView(eo.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, cdSize, true); e.setUint32(16, off, true);
  return new Blob(([] as BlobPart[]).concat(parts as BlobPart[], cd as BlobPart[], [eo as BlobPart]), { type: 'application/zip' });
}

/** Lê de volta um .zip gerado por makeZip (para teste de integridade). */
export function readZip(u8: Uint8Array): { name: string; data: Uint8Array; crcOk: boolean }[] {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), out: { name: string; data: Uint8Array; crcOk: boolean }[] = [];
  let o = 0;
  while (o + 30 <= u8.length && dv.getUint32(o, true) === 0x04034b50) {
    const crc = dv.getUint32(o + 14, true), sz = dv.getUint32(o + 18, true), nl = dv.getUint16(o + 26, true), xl = dv.getUint16(o + 28, true);
    const name = new TextDecoder().decode(u8.subarray(o + 30, o + 30 + nl));
    const data = u8.subarray(o + 30 + nl + xl, o + 30 + nl + xl + sz);
    out.push({ name, data, crcOk: crc32(data) === crc });
    o += 30 + nl + xl + sz;
  }
  return out;
}
