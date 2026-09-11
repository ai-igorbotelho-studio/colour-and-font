import { describe, it, expect } from 'vitest';
import { crc32, makeZip, readZip } from '../src/palette/zip';
import ref from './reference.json';

const te = new TextEncoder();

describe('CRC-32', () => {
  it('vetor conhecido: "123456789" → CBF43926', () => { expect(crc32(te.encode('123456789')).toString(16).toUpperCase()).toBe('CBF43926') });
  it('vazio → 0', () => { expect(crc32(new Uint8Array(0))).toBe(0) });
  it('bate com o original', () => { expect(crc32(te.encode('Farbenkreis'))).toBe(ref.core.crc) });
});

describe('integridade do pacote', () => {
  it('assinaturas, nomes, tamanhos e CRC de cada entrada conferem', async () => {
    const files = [{ name: 'a.txt', data: te.encode('alfa') }, { name: 'pasta/b.css', data: te.encode(':root{--x:1}') }, { name: 'c.bin', data: new Uint8Array([0, 255, 1, 254]) }];
    const blob = makeZip(files, new Date(2026, 8, 11, 10, 30, 0));
    const u8 = new Uint8Array(await blob.arrayBuffer());
    const dv = new DataView(u8.buffer);
    expect(dv.getUint32(0, true)).toBe(0x04034b50);
    // fim do diretório central: assinatura e contagem
    const eo = u8.length - 22;
    expect(dv.getUint32(eo, true)).toBe(0x06054b50);
    expect(dv.getUint16(eo + 10, true)).toBe(3);
    const back = readZip(u8);
    expect(back.map(x => x.name)).toEqual(files.map(f => f.name));
    back.forEach((x, i) => { expect(x.crcOk).toBe(true); expect(Array.from(x.data)).toEqual(Array.from(files[i].data)) });
  });
  it('nomes em UTF-8 sobrevivem à ida e volta', async () => {
    const blob = makeZip([{ name: 'ação-é.md', data: te.encode('ç') }]);
    const back = readZip(new Uint8Array(await blob.arrayBuffer()));
    expect(back[0].name).toBe('ação-é.md'); expect(back[0].crcOk).toBe(true);
  });
});
