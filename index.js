#!/usr/bin/env node
import chalk from 'chalk';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import {createSpinner} from 'nanospinner';
import fs from 'fs';
import {exec} from 'child_process';
import CPU from './CPU.js';

async function main() {
    figlet('AVM', function(err, data) {
console.log(gradient.pastel.multiline(data))
    });

    setTimeout(() => {
        console.clear();
        console.log(chalk.bold.yellow('Developed By: Amukh1'))
    const spinner = createSpinner('Loading..').start()

    setTimeout(() => {
      spinner.success({text: 'Done!'})
    //   go()
    croc()
    }, 1000)
    // console.log('\n')
    }, 2000)
}



function croc() {
    // console.log(process.argv)
    let args = process.argv.slice(2);
    // console.log(args)
    let code = fs.readFileSync(args[0].toString(), 'utf8');
    let outputMode;
    if(args[1]){
       outputMode = args[1].toString();
    }else {
        outputMode = 'None';
    }
    let cpu = new CPU(null, outputMode)
    cpu.load(code)
    cpu.run()
}

main()