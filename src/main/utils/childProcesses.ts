import { MessageChannelMain, utilityProcess } from 'electron';

async function forkAsync(scriptPath: string, argvs: string[] = []) {
	return new Promise((resolve, reject) => {
		const { port1 } = new MessageChannelMain();
		const childProcess = utilityProcess.fork(scriptPath, argvs);

		childProcess.postMessage({ message: 'start' }, [port1]);

		childProcess.on('message', (data) => {
			console.log('👉 -> file: childProcesses.ts:11 -> data:', data);
			resolve(data);
		});
	});
}

export { forkAsync };

// function spawnAsync(command, args: string[], options = {}) {
// 	// Return a new Promise
// 	return new Promise((resolve, reject) => {
// 		// Spawn the child process
// 		const childProcess = spawn(command, args, options);

// 		// Collect output (optional)
// 		let stdout = '';
// 		childProcess.stdout.on('data', (data) => {
// 			stdout += data.toString();
// 		});

// 		let stderr = '';
// 		childProcess.stderr.on('data', (data) => {
// 			stderr += data.toString();
// 		});

// 		// Resolve or reject the promise when the process exits
// 		childProcess.on('close', (code) => {
// 			if (code === 0) {
// 				resolve(stdout);
// 			} else {
// 				reject(new Error(`Command failed with code ${code}: ${stderr}`));
// 			}
// 		});

// 		// Handle errors
// 		childProcess.on('error', (error) => {
// 			reject(error);
// 		});
// 	});
// }
