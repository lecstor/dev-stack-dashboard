
### commits to master not in this branch
```
$ git cherry my-branch origin/master
+ 87babd2c67d97f3ac307f0e0824e6bedcab31935
+ 3ed2c0ceb9aa65741c26905c29e37819cd4251a5
+ 47bb9e9c1254396e1f20641aecef12e621084593
```

#### inc merge
```
$ git rev-list HEAD..origin/master
e8627811e29bc07774e2561d08ab80c2ca35b651
47bb9e9c1254396e1f20641aecef12e621084593
3ed2c0ceb9aa65741c26905c29e37819cd4251a5
87babd2c67d97f3ac307f0e0824e6bedcab31935
```

### last fetch
```
$ stat -c %Y .git/FETCH_HEAD
1596809276
$ stat -c %y .git/FETCH_HEAD
2020-08-08 00:07:56.494656610 +1000
```
> For anyone using this in a script: If a fetch or pull haven't been done yet then FETCH_HEAD won't exist yet and stat will return exit code 1.

### Inspecting Docker images without pulling them by

https://hackernoon.com/inspecting-docker-images-without-pulling-them-4de53d34a604

https://docs.docker.com/registry/spec/api/#pulling-a-layer

### Run external applications from Electron

```
import { spawn } from 'child_process'
const cmd = command[0]
const args = command[1]

const p = spawn(cmd, args)
p.stdout.on('data', (data) => {
  console.log('stdout: ' + data)
})

p.stderr.on('data', (data) => {
  console.log('stderr: ' + data)


p.on('close', (code) => {
  console.log('child process exited with code ' + code)
})
```

```
const processCmd = (cmd) => {
    var exec = require('child_process').exec;

    exec("ls -al", {timeout: 10000, maxBuffer: 20000*1024},
        function(error, stdout, stderr) {
            console.log(stdout.toString());
        });
}
```

https://github.com/martinjackson/electron-run-shell-example/blob/master/gui-funct.js

https://stackoverflow.com/questions/57054359/run-cmd-exe-and-make-some-command-with-electron-js

```
    const exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        callback(stdout); 
    });
};

// call the function
execute('ping -c 4 0.0.0.0', (output) => {
    console.log(output);
});
```
```
//Uses node.js process manager
const electron = require('electron');
const child_process = require('child_process');
const dialog = electron.dialog;

// This function will output the lines from the script 
// and will return the full combined output
// as well as exit code when it's done (using the callback).
function run_script(command, args, callback) {
    var child = child_process.spawn(command, args, {
        encoding: 'utf8',
        shell: true
    });
    // You can also use a variable to save the output for when the script closes later
    child.on('error', (error) => {
        dialog.showMessageBox({
            title: 'Title',
            type: 'warning',
            message: 'Error occured.\r\n' + error
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        //Here is the output
        data=data.toString();   
        console.log(data);      
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        // Return some data to the renderer process with the mainprocess-response ID
        mainWindow.webContents.send('mainprocess-response', data);
        //Here is the output from the command
        console.log(data);  
    });

    child.on('close', (code) => {
        //Here you can get the exit code of the script  
        switch (code) {
            case 0:
                dialog.showMessageBox({
                    title: 'Title',
                    type: 'info',
                    message: 'End process.\r\n'
                });
                break;
        }

    });
    if (typeof callback === 'function')
        callback();
}
```
```
var is = require("electron-is");

// Mac and Linux have Bash shell scripts (so the following would work)
//        var child = process.spawn('child', ['-l']);
//        var child = process.spawn('./test.sh');       
// Win10 with WSL (Windows Subsystem for Linux)  https://docs.microsoft.com/en-us/windows/wsl/install-win10
//   
// Win10 with Git-Bash (windows Subsystem for Linux) https://git-scm.com/   https://git-for-windows.github.io/
//

function appendOutput(msg) { getCommandOutput().value += (msg+'\n'); };
function setStatus(msg)    { getStatus().innerHTML = msg; };

function showOS() {
    if (is.windows())
      appendOutput("Windows Detected.")
    if (is.macOS())
      appendOutput("Apple OS Detected.")
    if (is.linux())
      appendOutput("Linux Detected.")
}

function backgroundProcess() {
    const process = require('child_process');   // The power of Node.JS

    showOS();
    var cmd = (is.windows()) ? 'test.bat' : './test.sh';      
    console.log('cmd:', cmd);
        
    var child = process.spawn(cmd); 

    child.on('error', function(err) {
      appendOutput('stderr: <'+err+'>' );
    });

    child.stdout.on('data', function (data) {
      appendOutput(data);
    });

    child.stderr.on('data', function (data) {
      appendOutput('stderr: <'+data+'>' );
    });

    child.on('close', function (code) {
        if (code == 0)
          setStatus('child process complete.');
        else
          setStatus('child process exited with code ' + code);

        getCommandOutput().style.background = "DarkGray";
    });
};
```

