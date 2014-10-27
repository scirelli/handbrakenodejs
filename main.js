var FS   = require("q-io/fs"),
    OS   = require('os'),
    fs   = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

var sMovieDir        = 'Z:\\Dvds Not Burned\\',//+ path.sep 
    sOutputDir       = 'Z:\\Compressed\\',
    sHandbrakeCLIDir = 'C:\\"Program Files"\\Handbrake\\';

fs.readdir( sMovieDir, function(err, aFiles){
    function run( aFiles, index, length ){
        var sMovieName    = aFiles[index],
            sAMovieDir    =  sMovieDir + sMovieName,
            sAMovieOutDir = sOutputDir + sMovieName,
            stats         = fs.statSync(sAMovieDir),
            aPresets      = [
                /*Sample       */ '-e x264 -q 21.0 -a 1,1 -E copy:ac3,copy:dts,copy:dtshd -D 0.0,0.0 -f m4v --detelecine --decomb --loose-anamorphic -m -x b-adapt=2:rc-lookahead=50',
                /*High Profile */ '-e x264 -q 20.0 -a 1,1 -E faac,copy:ac3 -B 160,160 -6 dpl2,auto -R Auto,Auto -D 0.0,0.0 --audio-copy-mask aac,ac3,dtshd,dts,mp3 --audio-fallback ffac3 -f mp4 -4 --decomb --loose-anamorphic --modulus 2 -m --x264-preset medium --h264-profile high --h264-level 4.1'
            ],
            aFileExt      = [
                'm4v'
            ],
            nPresetNo     = 1,
            sCommand      = sHandbrakeCLIDir + 'HandBrakeCLI.exe -i "' + sAMovieDir + '" -o "' + sAMovieOutDir + '.' + aFileExt[0] + '" ' + aPresets[nPresetNo],
            oChildProc    = null;

        if( stats.isDirectory() ){
            console.log(sAMovieDir); 

            oChildProc = exec( sCommand, { maxBuffer:5000*1024 }, function(error,stdout,stderr){
                console.log( 'Error: '  + error  );
                console.log( 'stdout: ' + stdout );
                console.log( 'stderr: ' + stderr );

                if( ++index < length ){
                    console.log('******* Count '+ index + ' *******************');
                    run( aFiles, index, length );
                }
            });
        }
    };
    if( !err ){
        run( aFiles.sort(), 0, aFiles.length );
    }
});

