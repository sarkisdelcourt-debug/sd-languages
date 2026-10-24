// Génère les enregistrements de voix de l'application (Piper, voix libres) : `npx tsx scripts/generate-audio.mts`
// Outils requis HORS dépôt (téléchargés des sources officielles) : piper.exe et les modèles .onnx dans PIPER_DIR
// (par défaut C:\Users\SD\piper-tools ; chemin court obligatoire sous Windows). Sortie : apps/web/public/audio.
//   piper : https://github.com/rhasspy/piper/releases  ·  voix : https://huggingface.co/rhasspy/piper-voices
// Voix : en_GB-alba-medium (CC BY 4.0, Université d'Édimbourg), de_DE-thorsten-medium (CC0), es_ES-davefx-medium (CC0).
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { runInThisContext } from "node:vm";
import { EXERCISES } from "../packages/shared/src/curriculum.js";
import { PRONUNCIATION_PROMPTS } from "../packages/shared/src/pronunciation.js";
import { VOCAB_SETS } from "../packages/shared/src/content/vocab-drills.js";

const require = createRequire(import.meta.url);
// lamejs ne se charge pas tel quel dans Node (MPEGMode introuvable) : on exécute son bundle complet.
runInThisContext(readFileSync(require.resolve("lamejs/lame.all.js"), "utf8"));
const lamejs = (globalThis as unknown as { lamejs: { Mp3Encoder: new (channels: number, rate: number, kbps: number) => { encodeBuffer(samples: Int16Array): Uint8Array; flush(): Uint8Array } } }).lamejs;
const PIPER_DIR = process.env.PIPER_DIR ?? "C:\\Users\\SD\\piper-tools";
const OUT = join(process.cwd(), "apps", "web", "public", "audio");
const WORK = join(PIPER_DIR, "work");
const MODELS = { en: "en_GB-alba-medium.onnx", de: "de_DE-thorsten-medium.onnx", es: "es_ES-davefx-medium.onnx" } as const;
const LANGUAGES = ["en", "de", "es"] as const;
type Lang = (typeof LANGUAGES)[number];

const clipId = (text: string) => createHash("sha1").update(text).digest("hex").slice(0, 10);
/** Texte réellement prononcé : sans précision entre parenthèses, sans « / » ni « sich » seul. */
const spoken = (text: string) => text.replace(/\s*\([^)]*\)/g, "").replace(/\s*\/\s*/g, ", ").replace(/\s+/g, " ").trim();

function collect(language: Lang): { texts: Set<string>; sentences: Set<string> } {
  const texts = new Set<string>();
  const sentences = new Set<string>();
  for (const exercise of EXERCISES) {
    if (exercise.language !== language) continue;
    if (exercise.audioText) { texts.add(exercise.audioText); sentences.add(exercise.audioText); }
    if (["translation", "word-bank", "listening"].includes(exercise.type) && exercise.answer.trim().length > 1) {
      texts.add(exercise.answer); if (exercise.answer.split(/\s+/).length >= 3) sentences.add(exercise.answer);
    }
  }
  for (const prompt of PRONUNCIATION_PROMPTS) if (prompt.language === language) { texts.add(prompt.text); sentences.add(prompt.text); }
  for (const set of VOCAB_SETS[language]) for (const item of set.items) texts.add(item.en);
  return { texts, sentences };
}

function runPiper(language: Lang, jobs: Array<{ text: string; file: string }>, lengthScale: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(join(PIPER_DIR, "piper", "piper.exe"), ["-m", join(PIPER_DIR, MODELS[language]), "--json-input", "--length_scale", String(lengthScale), "-q"], { cwd: join(PIPER_DIR, "piper") });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`piper ${language} a quitté avec ${code} : ${stderr.slice(-400)}`))));
    child.on("error", reject);
    for (const job of jobs) child.stdin.write(`${JSON.stringify({ text: spoken(job.text), output_file: job.file })}\n`);
    child.stdin.end();
  });
}

function wavToMp3(wavPath: string): Buffer {
  const wav = readFileSync(wavPath);
  // En-tête RIFF : on cherche le bloc « data » plutôt que de supposer 44 octets.
  let offset = 12;
  let dataStart = 44;
  let dataLength = wav.length - 44;
  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === "data") { dataStart = offset + 8; dataLength = Math.min(size, wav.length - dataStart); break; }
    offset += 8 + size;
  }
  const sampleRate = wav.readUInt32LE(24);
  const samples = new Int16Array(wav.buffer.slice(wav.byteOffset + dataStart, wav.byteOffset + dataStart + (dataLength & ~1)));
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, 32);
  const parts: Buffer[] = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const chunk = encoder.encodeBuffer(samples.subarray(i, i + 1152));
    if (chunk.length) parts.push(Buffer.from(chunk));
  }
  const end = encoder.flush();
  if (end.length) parts.push(Buffer.from(end));
  return Buffer.concat(parts);
}

const manifest: { version: number; voices: Record<string, string>; clips: Record<string, Record<string, string>>; slow: Record<string, string[]> } = {
  version: 1,
  voices: { en: "Piper en_GB-alba-medium (CC BY 4.0)", de: "Piper de_DE-thorsten-medium (CC0)", es: "Piper es_ES-davefx-medium (CC0)" },
  clips: { en: {}, de: {}, es: {} },
  slow: { en: [], de: [], es: [] }
};
let totalBytes = 0;
let totalClips = 0;
const limit = Number(process.env.LIMIT ?? 0);

for (const language of LANGUAGES) {
  const { texts, sentences } = collect(language);
  mkdirSync(join(OUT, language), { recursive: true });
  mkdirSync(WORK, { recursive: true });
  const all = [...texts].filter((text) => spoken(text).length > 0).slice(0, limit || undefined);
  const jobs = all.map((text) => ({ text, file: join(WORK, `${language}-${clipId(text)}.wav`) }));
  await runPiper(language, jobs, 1.0);
  for (const job of jobs) {
    const id = clipId(job.text);
    const mp3 = wavToMp3(job.file);
    writeFileSync(join(OUT, language, `${id}.mp3`), mp3);
    rmSync(job.file);
    manifest.clips[language]![job.text] = id;
    totalBytes += mp3.length; totalClips += 1;
  }
  const slowJobs = all.filter((text) => sentences.has(text)).map((text) => ({ text, file: join(WORK, `${language}-${clipId(text)}-s.wav`) }));
  await runPiper(language, slowJobs, 1.55);
  for (const job of slowJobs) {
    const id = clipId(job.text);
    const mp3 = wavToMp3(job.file);
    writeFileSync(join(OUT, language, `${id}-s.mp3`), mp3);
    rmSync(job.file);
    manifest.slow[language]!.push(id);
    totalBytes += mp3.length; totalClips += 1;
  }
  console.log(`${language}: ${jobs.length} clips, ${slowJobs.length} lents`);
}
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest));
console.log(`Total : ${totalClips} fichiers, ${(totalBytes / 1_048_576).toFixed(1)} Mo`);
if (!existsSync(join(OUT, "manifest.json"))) process.exit(1);
