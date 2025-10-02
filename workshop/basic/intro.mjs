import { createReadStream, createWriteStream, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Readable, Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(dirname(import.meta.url));

const FILE_PATH = join(__dirname, './bees.txt');
const decoder = new TextDecoder();

const stream = createReadStream(FILE_PATH, {
  highWaterMark: 1 * 1024  // 1KB chunks
});
const webStream = Readable.toWeb(stream);

let longestWordStream = '';
let index = 0;

const outputFile = join(__dirname, './longest-word-stream.txt');
try {
  rmSync(outputFile);
} catch { }
const writeStream = createWriteStream(outputFile);
const webWriteStream = Writable.toWeb(writeStream);

const writer = webWriteStream.getWriter();
await writer.ready
for await (const chunk of webStream) {
  const words = decoder.decode(chunk).split(/\s+|\n/);
  for (const word of words) {
    if (word.length > longestWordStream.length) {
      longestWordStream = word;
    }
  }
  console.log({ longestWordStream, index });

  await writer.write(decoder.decode(chunk));
  await writer.write('\n===============================================\n');
  await writer.write(`Longest word: ${longestWordStream}`);
  await writer.write('\n===============================================\n\n');

  index++;
}

await writer.close();


let longestWordFile = '';
const fullContent = readFileSync(FILE_PATH);
const fullContentWords = decoder.decode(fullContent).split(/\s+|\n/);

for (const word of fullContentWords) {
  if (word.length > longestWordFile.length) {
    longestWordFile = word;
  }
}
console.log({ longestWordFile });