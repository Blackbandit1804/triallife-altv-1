import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import { exec } from 'promisify-child-process';

const StartTime = Date.now();
const MainPath = process.cwd();
const ResourcesPath = path.join(MainPath, 'resources');
const SourceFiles = new glob.GlobSync('./src/**/*.!(ts)').found;
let copiedFiles = 0;
let compilationPromise;

async function buildPipeline() {
    console.log(`[3L:RP] Starting Compilation`);

    if (!process.argv.includes('WATCHING')) {
        // Remove old resource files.
        if (fs.existsSync(ResourcesPath)) {
            await new Promise((resolve) => {
                rimraf(ResourcesPath, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    resolve();
                });
            });
        }

        console.log(`[3L:RP] Compiling Typescript`);
        compilationPromise = exec('tsc', { cwd: MainPath }).catch((err) => {
            if (err.stdout) {
                console.log('\r\n');
                console.log('-----[ READ THIS CAREFULLY ]-------');
                console.log(`Failed to build correctly!`);
                console.log(`This means that a file, code, or data is incorrectly formatted.`);
                console.log(`Run the following command in terminal, command line,`);
                console.log(`or powershell for more information...\r\n`);
                console.log(`Command: npx tsc`);
                console.log('-----------------------------------\r\n');
                console.log(`Errors in Code Found:`);
                console.error(err.stdout);
                process.exit();
            }
        });
    }

    // Handle Source Copy
    console.log(`[3L:RP] Copy Compiled Content`);
    for (let i = 0; i < SourceFiles.length; i++) {
        const oldPath = SourceFiles[i];
        const newPath = SourceFiles[i].replace('src', 'resources');
        const dirName = path.dirname(newPath).normalize();
        if (!fs.existsSync(dirName)) fs.mkdirSync(dirName, { recursive: true });
        fs.copyFileSync(oldPath, newPath);
        copiedFiles += 1;
    }
    console.log(`[3L:RP] Copied ${copiedFiles} Extra Files for Trial Life`);
    if (compilationPromise) await compilationPromise;
    const CompiledFiles = new glob.GlobSync('./tlrp-cache/**/*.!(ts)').found;
    for (let i = 0; i < CompiledFiles.length; i++) {
        const oldPath = CompiledFiles[i];
        const newPath = CompiledFiles[i].replace('tlrp-cache', 'resources');
        const dirName = path.dirname(newPath).normalize();
        if (!fs.existsSync(dirName)) fs.mkdirSync(dirName, { recursive: true });
        fs.copyFileSync(oldPath, newPath);
        copiedFiles += 1;
    }

    console.log(`[3L:RP] Build Time: ${Date.now() - StartTime}ms`);
}

buildPipeline();
