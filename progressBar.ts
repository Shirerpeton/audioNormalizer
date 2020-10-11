import readline from 'readline';

const progressBar = (barLength: number, percent: number, title: string): string => {
    let onePart: number = barLength / 100.0;
    percent = Math.floor(percent);
    let percentStr: string;
    if (percent < 10)
        percentStr = '  ' + percent;
    else if (percent < 100)
        percentStr = ' ' + percent;
    else
        percentStr = String(percent);
    let str: string = title + ": " + percentStr + "%";
    str += '[';
    let progress: string = '='.repeat((percent) * onePart) + '>';
    progress += '-'.repeat(barLength - (progress.length - 1));
    str += progress + ']';
    return str;
}

const drawProgressBar = (percent: number, title: string = 'Current progress'): void => {
    let barLength: number = process.stdout.columns - 30;
    console.log(progressBar(barLength, percent, title));
}

const redrawProgressBar = (percent: number, title: string = 'Current progress'): void => {
    readline.moveCursor(process.stdout, -process.stdout.columns, -1);
    readline.clearScreenDown(process.stdout);
    drawProgressBar(percent, title);
}

export default {drawProgressBar, redrawProgressBar};