'use strict';

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

import progressBar from './progressBar.js'

const inputDir = './input/';
const outputDir = './output/';

ffmpeg.setFfmpegPath('./ffmpeg/bin/ffmpeg.exe');
ffmpeg.setFfprobePath('./ffmpeg/bin/ffprobe.exe');

interface File {
    name: string,
    progress: number,
    done: boolean
}

let files: File[] = [];
fs.readdirSync('./input/').forEach(fileName => {
    let file: File = { name: fileName, progress: 0, done: false };
    files.push(file);
});

let totalProgress = 0;

const main = async () => {
    if (files.length >= 1) {
        console.log(`To proccess: ${files.length} files`);
        progressBar.drawProgressBar(totalProgress);
    }
    for (let i = 0; i < files.length; i++) {
        const input: string = files[i].name;
        const output: string = input.split('.').slice(0, -1).join() + '.mp3';
        ffmpeg(inputDir + input).audioCodec('libmp3lame').output(outputDir + output).outputOptions(['-q:a 2']).audioFilter('loudnorm')
            .on('error', err => {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', () => {
                files[i].done = true;
                if (files.every(elem => elem.done)) progressBar.redrawProgressBar(100);
            })
            .on('progress', progress => {
                files[i].progress = progress.percent;
                const newTotalProgress = files.reduce((sum, elem) => sum + elem.progress, 0) / files.length;
                if (newTotalProgress - totalProgress >= 1) {
                    progressBar.redrawProgressBar(totalProgress);
                    totalProgress = newTotalProgress;
                }
            }).run();
    }
    return;
}

main();