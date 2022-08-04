import chalk from 'chalk';

let opcodes = {
    'No-Op': '0000', 
    'Halt': '0001',
    'INPUT': '0010',
    'OUTPUT': '0011',
    'STORE': '0100',
    'LOAD': '0101',
    'ADD': '0110',
    'SUB': '0111',
    'BITWISE': '1000',
    '-BITWISE': '1001',
    'LOAD_IMDT': '1010',
    'JMP': '1011',
    'BRANCH': '1100',
}

class CPU {
    constructor(memory, om) {
        this.memory = memory;
        this.isa = {
            '0000': 'No-Op',
            '0001': 'Halt',
            '0010': 'INPUT',
            '0011': 'OUTPUT',
            '0100': 'STORE',
            '0101': 'LOAD',
            '0110': 'ADD',
            '0111': 'SUB',
            '1000': 'BITWISE',
            '1001': '-BITWISE',
            '1010': 'LOAD_IMDT',
            '1011': 'JMP',
            '1100': 'BRANCH',
            '1101': 'CALL',
            '1110': 'RETURN',
            '1111': 'MATH',
        }
        this.registers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.ports = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.ram = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.current = 0;
        this.outputMode = om;
    }
    execute(instructio) {
        if(instructio == undefined) {
            return;
        }
        let instruction = instructio.split('\r').join('');
        // console.log(instruction)
        // console.log(this.isa)
            let opcode = instruction.slice(0, 4);
            // console.log(opcode)
            let op = this.isa[opcode.toString()];
            // console.log(op)
            let operands = instruction.slice(4);
            if(op == "Halt") {
                console.log(chalk.bold.red("Program halted"));
                process.exit(1);
            }else if(op == "INPUT") {
                let dest = operands.slice(0, 1);
                let port = operands.slice(10);
                this.input(port, dest);
            }else if(op == "OUTPUT") {
                // let src = operands.slice(6, 7);
                // let port = operands.slice(10);
                // 8
                let port = operands.slice(4, 6);
                let src = operands.slice(6);
                // console.log(src)
                this.output(port, src);
            }else if(op == "STORE") {
                let src = operands.slice(6, 7);
                let dest = operands.slice(9);
                this.ram[parseInt(dest, 2)] = this.registers[parseInt(src, 2)]
            }else if(op == "LOAD") {
                let dest = operands.slice(0, 1);
                let src = operands.slice(9);
                this.registers[parseInt(dest, 2)] = this.ram[parseInt(src, 2)]
            }else if(op == "ADD") {
                let dest = operands.slice(0,2);
                let x = operands.slice(2);
                let a = x.split(',')[0] - 0;
                let b = x.split(',')[1] - 0;
                // console.log(dest, a + b)
                this.registers[parseInt(dest)] = a + b;
            }else if(op == "SUB") {
                let dest = operands.slice(0,2);
                let x = operands.slice(2);
                let a = x.split(',')[0] - 0;
                let b = x.split(',')[1] - 0;
                // console.log(dest, a + b)
                this.registers[parseInt(dest)] = a - b;
            }else if(op == "BITWISE") {
                let dest = operands.slice(0,2);
                let x = operands.slice(2);
                let a = x.split(',')[0] - 0;
                let b = x.split(',')[1] - 0;
                // console.log(dest, a + b)
                this.registers[parseInt(dest)] = a && b;
            }else if(op == "-BITWISE") {
                let dest = operands.slice(0,2);
                let x = operands.slice(2);
                let a = x.split(',')[0] - 0;
                let b = x.split(',')[1] - 0;
                // console.log(dest, a + b)
                this.registers[parseInt(dest)] = !(a + b);
            }else if(op == "LOAD_IMDT") {
                // console.log('eh')
                let dest = operands.slice(0, 2);
                let src = operands.slice(4);
                // console.log(src, dest)
                this.registers[parseInt(dest)] = src;
            }else if(op == "JMP") {
                let dest = operands.slice(4);
                this.current = parseInt(dest);
            }else if(op == "BRANCH") {
                let condition = operands.slice(2,3); // later
                let dest = operands.slice(4);
                this.current = parseInt(dest);
            }else if(op == "CALL") {
                let dest = operands.slice(4);
                this.registers[4] = this.current;
                this.current = parseInt(dest);
            }else if(op == "RETURN") {
                this.current = this.registers[4];
            }else if(op == "MATH") {
                let dest = operands.slice(0,2);
                let x = operands.slice(2);
                let a = x.split(',')[0] - 0;
                let b = x.split(',')[1] - 0;
                // console.log(dest, a + b)
                this.registers[parseInt(dest)] = a * b;
            }

    }
    input(port, dest){
        this.registers[parseInt(dest, 2)] = this.ports[parseInt(port, 2)];
    }
    output(port, src){
        // console.log(port, src);
        // console.log(this.registers)
        this.ports[parseInt(port, 2)] = this.registers[parseInt(src)];
        if(port == "06"){
            // console.log(chalk.bold.green(src))
            console.log(chalk.bold.green(this.registers[parseInt(src)]));
        }
        if(this.outputMode == "console"){
            // console.log(chalk.bold.blue(`${port}: ${src}`));
            console.log(chalk.bold.blue(this.registers[parseInt(src)]));
        }
    }
    load(rom){
        // console.log(rom)
        this.memory = rom.split('\n')
    }
    run() {
        this.execute(this.memory[this.current]);
        this.current++;
            this.run();
   
    }
}

export default CPU;